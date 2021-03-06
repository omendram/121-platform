import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { QRCodeModule } from 'angularx-qrcode';
import { MockPaDataService } from 'src/app/mocks/padata.service.mock';
import { ConversationService } from 'src/app/services/conversation.service';
import { PaDataService } from 'src/app/services/padata.service';
import { RegistrationSummaryComponent } from './registration-summary.component';

describe('RegistrationSummaryComponent', () => {
  let component: RegistrationSummaryComponent;
  let fixture: ComponentFixture<RegistrationSummaryComponent>;

  beforeEach(async(() => {
    const conversationService = jasmine.createSpyObj('ConversationService', {
      startLoading: jasmine.createSpy(),
      stopLoading: jasmine.createSpy(),
      onSectionCompleted: jasmine.createSpy(),
    });

    TestBed.configureTestingModule({
      declarations: [RegistrationSummaryComponent],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        QRCodeModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ConversationService,
          useValue: conversationService,
        },
        {
          provide: PaDataService,
          useValue: MockPaDataService,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
