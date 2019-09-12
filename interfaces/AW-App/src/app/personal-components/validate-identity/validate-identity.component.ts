import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProgramsServiceApiService } from 'src/app/services/programs-service-api.service';
import { Storage } from '@ionic/storage';
import { PersonalComponent } from '../personal-components.interface';
import { ConversationService } from 'src/app/services/conversation.service';

@Component({
  selector: 'app-validate-identity',
  templateUrl: './validate-identity.component.html',
  styleUrls: ['./validate-identity.component.scss'],
})
export class ValidateIdentityComponent implements PersonalComponent {

  public did: any;
  public answers: any;
  public credentialIssued = false;
  public verificationPostponed = false;

  constructor(
    public programsService: ProgramsServiceApiService,
    public storage: Storage,
    public conversationService: ConversationService,
  ) { }

  ngOnInit() { }

  public getPrefilledAnswersIdentity(did: string) {
    this.storage.get('scannedDid').then(value => {
      this.programsService.getPrefilledAnswers(value, null).subscribe(response => {
        this.answers = response;
        this.verificationPostponed = false;
      });
    });
  }

  public postponeVerification() {
    this.verificationPostponed = true;
  }

  public issueIdentityCredential(did: string) {
    this.storage.get('scannedDid').then(value => {
      // MVP: For identity no credential is issued. So only answers are read in frontend, and then deleted.
      this.programsService.deletePrefilledAnswers(value, null).subscribe(response => {
        console.log('response: ', response);
        console.log('Identity credential issued');
        this.credentialIssued = true;
        this.answers = null;
        this.complete();
      });
    });
  }

  getNextSection() {
    return 'validate-program';
  }

  complete() {
    this.conversationService.onSectionCompleted({
      name: 'validate-identity',
      data: {
      },
      next: this.getNextSection(),
    });
  }

}
