import { Storage } from '@ionic/storage';
import { SessionStorageService } from './../../services/session-storage.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ValidationComponent } from '../validation-components.interface';
import { ConversationService } from 'src/app/services/conversation.service';
import { ProgramsServiceApiService } from 'src/app/services/programs-service-api.service';
import { ValidationComponents } from '../validation-components.enum';
import { IonicStorageTypes } from 'src/app/services/iconic-storage-types.enum';
import { TimeoutError } from 'rxjs';

@Component({
  selector: 'app-scan-qr',
  templateUrl: './scan-qr.component.html',
  styleUrls: ['./scan-qr.component.scss'],
})
export class ScanQrComponent implements ValidationComponent {
  public gettingDid = false;

  public did: string;
  public programId: number;
  public scanError = false;
  public didResult = false;
  public unknownDidCombination = false;
  public returnMainMenu = false;

  public ionicStorageTypes = IonicStorageTypes;

  constructor(
    private router: Router,
    public conversationService: ConversationService,
    public programsService: ProgramsServiceApiService,
    public sessionStorageService: SessionStorageService,
    private storage: Storage
  ) {
  }

  async ngOnInit() {
    console.log('init scan qr');
    this.scanQrCode();
  }

  public async scanQrCode() {
    const storageSubscription = this.sessionStorageService.watchStorage().subscribe(async () => {
      await this.checkScannedData();
      storageSubscription.unsubscribe();
      // this will call whenever your localStorage data changes
      // use localStorage code here and set your data here for ngFor
    });
    this.router.navigate(['/scan-qr']);
  }

  public async checkScannedData() {
    this.gettingDid = true;
    this.sessionStorageService.retrieve(this.sessionStorageService.type.scannedData).then(async data => {
      if (this.isNotJson(data)) {
        this.scanError = true;
        return;
      }

      const jsonData = JSON.parse(data);
      if (!jsonData && !jsonData.did && !jsonData.programId) {
        this.scanError = true;
        console.log('this.scanError: ', this.scanError);
        return;
      }

      this.did = jsonData.did;
      this.programId = jsonData.programId;

      let didData = await this.findDidDataOffline();
      if (!didData) {
        didData = await this.findDidDataOnline();
      }
      this.gettingDid = false;
      if (didData) {
        this.sessionStorageService.store(this.sessionStorageService.type.paData, JSON.stringify(didData));
        this.foundCorrectDid();
      } else {
          this.unknownDidCombination = true;
          console.log('this.scanError: unknownDidCombination');
      }
    });
  }

  private async findDidDataOnline(): Promise<void> {
    console.log('findDidDataOnline');
    try {
      const response = await this.programsService.getPrefilledAnswers(this.did, this.programId).toPromise();
      if (response.length === 0) {
        return;
      }
      return response;
    } catch (e) {
        console.log('Error: ', e.name);
        if (e.status === 0 || e instanceof TimeoutError) {
          return;
        }
    }
  }

  private async findDidDataOffline(): Promise<any> {
    console.log('findDidOffline');
    const offlineData = await this.storage.get(this.ionicStorageTypes.validationData);
    if (!offlineData) {
      return;
    }
    const prefilledQuestions = [];
    if (offlineData) {
      offlineData.forEach(element => {
        if (this.did === element.did && this.programId === element.programId) {
          prefilledQuestions.push(element);
        }
      });
      if (prefilledQuestions.length > 0) {
        return prefilledQuestions;
      }
    }
  }

  private foundCorrectDid(): void {
    console.log('foundCorrectDid');
    this.didResult = true;
    this.unknownDidCombination = false;
    this.scanError = false;
    this.complete();
  }

  public backMainMenu() {
    this.returnMainMenu = true;
    this.conversationService.onSectionCompleted({
      name: ValidationComponents.scanQr,
      data: {
      },
      next: ValidationComponents.mainMenu,
    });
  }

  getNextSection() {
    return ValidationComponents.validateProgram;
  }

  isNotJson(str: string): boolean {
    try {
      JSON.parse(str);
    } catch (e) {
      return true;
    }
    return false;
  }

  complete() {
    this.conversationService.onSectionCompleted({
      name: ValidationComponents.scanQr,
      data: {
      },
      next: this.getNextSection(),
    });
  }

}
