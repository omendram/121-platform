import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Program } from '../models/program.model';
import { JwtService } from './jwt.service';
import { PaAccountApiService } from './pa-account-api.service';
import { PaDataTypes } from './padata-types.enum';
import { ProgramsServiceApiService } from './programs-service-api.service';
import { SovrinService } from './sovrin.service';

@Injectable({
  providedIn: 'root',
})
export class PaDataService {
  private useLocalStorage: boolean;

  public type = PaDataTypes;

  public hasAccount = false;
  private username: string;

  private currentProgramId: number;
  private myPrograms: Program[] = [];
  public myAnswers: any = {};

  private authenticationStateSource = new BehaviorSubject<boolean>(false);
  public authenticationState$ = this.authenticationStateSource.asObservable();

  constructor(
    private ionStorage: Storage,
    private paAccountApi: PaAccountApiService,
    private programService: ProgramsServiceApiService,
    private sovrinService: SovrinService,
    private jwtService: JwtService,
  ) {
    this.useLocalStorage = environment.localStorage;

    this.retrieveLoggedInState();
  }

  private setUsername(username: string) {
    this.username = username;
    window.sessionStorage.setItem(this.type.username, username);
  }

  public async getUsername(): Promise<string> {
    if (!this.username) {
      this.username = window.sessionStorage.getItem(this.type.username);
    }

    return new Promise<string>((resolve, reject) => {
      if (!this.username) {
        return reject();
      }

      return resolve(this.username);
    });
  }

  public setCurrentProgramId(programId: number) {
    this.currentProgramId = programId;
    this.store(this.type.programId, programId);
  }

  private async getProgram(programId: number): Promise<Program> {
    // If not already available, fall back to get it from the server
    if (!this.myPrograms[programId]) {
      this.myPrograms[programId] = await this.programService.getProgramById(
        programId,
      );
    }

    return this.myPrograms[programId];
  }

  public async getCurrentProgram(): Promise<Program> {
    if (!this.currentProgramId) {
      this.currentProgramId = Number(await this.retrieve(this.type.programId));

      // Fall back to hard-coded value, if all else fails
      if (!this.currentProgramId) {
        this.currentProgramId = 1;
      }
    }

    return await this.getProgram(this.currentProgramId);
  }

  public async saveAnswers(programId: number, answers: any): Promise<any> {
    this.myAnswers[programId] = answers;
    return this.store(this.type.myAnswers, this.myAnswers);
  }

  /////////////////////////////////////////////////////////////////////////////
  // ALL types of storage:
  /////////////////////////////////////////////////////////////////////////////

  async store(type: string, data: any, forceLocalOnly = false): Promise<any> {
    if (!this.useLocalStorage && !this.hasAccount) {
      return;
    }

    if (this.useLocalStorage || forceLocalOnly) {
      return this.ionStorage.set(type, data);
    }

    return this.paAccountApi.store(type, JSON.stringify(data));
  }

  async retrieve(type: string, forceLocalOnly = false): Promise<any> {
    if (!this.useLocalStorage && !this.hasAccount) {
      return;
    }

    if (this.useLocalStorage || forceLocalOnly) {
      return this.ionStorage.get(type);
    }

    return await this.paAccountApi.retrieve(type);
  }

  /////////////////////////////////////////////////////////////////////////////
  // ONLY for WEB users:
  /////////////////////////////////////////////////////////////////////////////
  private featureNotAvailable(): Promise<any> {
    return new Promise((resolve) => {
      return resolve('Not available with local storage');
    });
  }

  async createAccount(username: string, password: string): Promise<any> {
    if (this.useLocalStorage) {
      return this.featureNotAvailable();
    }

    // 'Sanitize' username:
    username = username.trim();

    console.log('PaData: createAccount()');
    return this.paAccountApi.createAccount(username, password).then(() => {
      console.log('Account created.');
      this.setLoggedIn();
      this.setUsername(username);
    });
  }

  async login(username: string, password: string): Promise<any> {
    if (this.useLocalStorage) {
      return this.featureNotAvailable();
    }

    return new Promise((resolve, reject) => {
      this.paAccountApi.login(username, password).then(
        (response) => {
          console.log('PaData: login successful', response);
          this.ionStorage.clear();
          this.setLoggedIn();
          this.setUsername(response.username);
          return resolve(response);
        },
        (error) => {
          console.log('PaData: login error', error);
          this.setLoggedOut();
          return reject(error);
        },
      );
    });
  }

  private setLoggedIn() {
    console.log('PaData: setLoggedIn()');
    this.hasAccount = true;
    this.authenticationStateSource.next(true);
  }

  private setLoggedOut() {
    console.log('PaData: setLoggedOut()');
    this.hasAccount = false;
    this.authenticationStateSource.next(false);
  }

  private retrieveLoggedInState() {
    const token = this.jwtService.getToken();

    if (!token) {
      return;
    }

    this.setLoggedIn();
  }

  public logout() {
    if (this.useLocalStorage) {
      return this.featureNotAvailable();
    }

    console.log('PaData: logout()');
    this.jwtService.destroyToken();
    window.sessionStorage.removeItem(this.type.username);
    this.ionStorage.clear();
    this.setLoggedOut();
  }

  public setDid(did: string) {
    if (this.useLocalStorage) {
      return this.featureNotAvailable();
    }

    return this.paAccountApi.setDid(did);
  }

  public async deleteIdentity(password: string): Promise<any> {
    if (this.useLocalStorage) {
      return this.featureNotAvailable();
    }

    const wallet = await this.retrieve(this.type.wallet);
    const did = await this.retrieve(this.type.did);

    // All requests are dependent on their predecessors!
    // A wallet should only be deleted if the account is already successfully deleted
    // A connection should only be deleted if the wallet is already successfully deleted
    return new Promise(async (resolve, reject) => {
      if (!this.hasAccount) {
        return reject('');
      }

      await this.paAccountApi.deleteAccount(password).then(
        async () => {
          let deleteWalletResult = false;
          let deleteConnectionResult = false;

          await this.sovrinService.deleteWallet(wallet).then(
            () => (deleteWalletResult = true),
            (error) => reject(error),
          );

          await this.programService.deleteConnection(did).then(
            () => (deleteConnectionResult = true),
            (error) => reject(error),
          );

          if (deleteWalletResult && deleteConnectionResult) {
            this.setLoggedOut();
            return resolve(true);
          }
        },
        (error) => reject(error),
      );
    });
  }
}
