import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { ConsentQuestionComponent } from '../personal-components/consent-question/consent-question.component';
import { ContactDetailsComponent } from '../personal-components/contact-details/contact-details.component';
import { CreateIdentityComponent } from '../personal-components/create-identity/create-identity.component';
import { EnrollInProgramComponent } from '../personal-components/enroll-in-program/enroll-in-program.component';
import { LoginIdentityComponent } from '../personal-components/login-identity/login-identity.component';
import { PersonalComponent } from '../personal-components/personal-component.class';
import { PersonalComponents } from '../personal-components/personal-components.enum';
import { PreprintedQrcodeComponent } from '../personal-components/preprinted-qrcode/preprinted-qrcode.component';
import { RegistrationSummaryComponent } from '../personal-components/registration-summary/registration-summary.component';
import { SelectFspComponent } from '../personal-components/select-fsp/select-fsp.component';
import { SelectLanguageComponent } from '../personal-components/select-language/select-language.component';
import { SelectProgramComponent } from '../personal-components/select-program/select-program.component';
import { SetNotificationNumberComponent } from '../personal-components/set-notification-number/set-notification-number.component';
import { SignupSigninComponent } from '../personal-components/signup-signin/signup-signin.component';
import { StoreCredentialComponent } from '../personal-components/store-credential/store-credential.component';
import {
  ConversationSection,
  ConversationService,
} from '../services/conversation.service';
import { ProgramsServiceApiService } from '../services/programs-service-api.service';
import { HandleProofComponent } from './../personal-components/handle-proof/handle-proof.component';

@Component({
  selector: 'app-personal',
  templateUrl: 'personal.page.html',
  styleUrls: ['personal.page.scss'],
})
export class PersonalPage implements OnInit {
  @ViewChild(IonContent)
  public ionContent: IonContent;

  @ViewChild('conversationContainer', { read: ViewContainerRef })
  public container: ViewContainerRef;

  public isDebug: boolean = environment.isDebug;
  public showDebug: boolean = environment.showDebug;

  private scrollSpeed = environment.useAnimation ? 600 : 0;

  public availableSections = {
    [PersonalComponents.consentQuestion]: ConsentQuestionComponent,
    [PersonalComponents.contactDetails]: ContactDetailsComponent,
    [PersonalComponents.createIdentity]: CreateIdentityComponent,
    [PersonalComponents.enrollInProgram]: EnrollInProgramComponent,
    [PersonalComponents.handleProof]: HandleProofComponent,
    [PersonalComponents.loginIdentity]: LoginIdentityComponent,
    [PersonalComponents.registrationSummary]: RegistrationSummaryComponent,
    [PersonalComponents.preprintedQrcode]: PreprintedQrcodeComponent,
    [PersonalComponents.selectFsp]: SelectFspComponent,
    [PersonalComponents.selectLanguage]: SelectLanguageComponent,
    [PersonalComponents.selectProgram]: SelectProgramComponent,
    [PersonalComponents.setNotificationNumber]: SetNotificationNumberComponent,
    [PersonalComponents.signupSignin]: SignupSigninComponent,
    [PersonalComponents.storeCredential]: StoreCredentialComponent,
  };
  public debugSections = Object.keys(this.availableSections);

  constructor(
    public programsService: ProgramsServiceApiService,
    public conversationService: ConversationService,
    private resolver: ComponentFactoryResolver,
    private storage: Storage,
    public translate: TranslateService,
  ) {
    // Listen for completed sections, to continue with next steps
    this.conversationService.updateConversation$.subscribe(
      async (nextAction: string) => {
        if (
          nextAction === this.conversationService.conversationActions.afterLogin
        ) {
          await this.loadComponents();
          this.scrollToLastWhenReady();
          return;
        }

        this.insertSection(nextAction);
      },
    );
    // Listen for scroll events
    this.conversationService.shouldScroll$.subscribe((toY: number) => {
      if (toY === -1) {
        return this.scrollDown();
      }

      if (toY === -2) {
        return this.scrollToLastWhenReady();
      }

      this.ionContent.scrollToPoint(0, toY, this.scrollSpeed);
    });
  }

  async ngOnInit() {
    // Prevent automatic behaviour while debugging/developing:
    if (this.isDebug && this.showDebug) {
      return;
    }

    await this.loadComponents();
    this.scrollToLastWhenReady();
  }

  private async loadComponents() {
    // Always start with a clean slate:
    this.container.clear();

    const conversation = await this.conversationService.getConversationUpToNow();

    conversation.forEach((section: ConversationSection) => {
      this.insertSection(
        section.name,
        { animate: false },
        section.moment,
        section.data,
      );
    });
  }

  private getComponentFactory(name: string) {
    return this.resolver.resolveComponentFactory(this.availableSections[name]);
  }

  public insertSection(
    name: string,
    options: { animate: boolean } = { animate: environment.useAnimation },
    moment?: number,
    data?: any,
  ) {
    if (!name) {
      return;
    }

    console.log('PersonalPage insertSection(): ', name);

    const componentRef = this.container.createComponent(
      this.getComponentFactory(name),
    );
    const componentInstance: any | PersonalComponent = componentRef.instance;

    componentInstance.moment = moment;
    componentInstance.data = data;
    componentInstance.animate = options.animate;
  }

  public scrollDown() {
    this.ionContent.scrollToBottom(this.scrollSpeed);
  }

  public scrollToLastSection() {
    const lastSection: any = this.container.get(this.container.length - 1);

    if (!lastSection || !lastSection.rootNodes || !lastSection.rootNodes[0]) {
      return;
    }
    lastSection.rootNodes[0].scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }

  private async scrollToLastWhenReady() {
    window.setTimeout(() => {
      this.scrollToLastSection();
    }, 600);
  }

  public debugClearAllStorage() {
    this.storage.clear();
    window.localStorage.clear();
    window.sessionStorage.clear();
  }

  public async debugStartFromHistory() {
    await this.loadComponents();
    this.scrollToLastWhenReady();
  }
}
