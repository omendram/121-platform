import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { formatDate } from '@angular/common';
import { ProgramsServiceApiService } from 'src/app/services/programs-service-api.service';
import { UserRole } from 'src/app/auth/user-role.enum';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-manage-aidworkers',
  templateUrl: './manage-aidworkers.component.html',
  styleUrls: ['./manage-aidworkers.component.scss'],
})
export class ManageAidworkersComponent implements OnInit {
  @Input()
  public programId: number;

  public emailAidworker: string;
  public passwordAidworker: string;
  public passwordMinLength = 8;

  public columns = [
    {
      prop: 'email',
      name: this.translate.instant(
        'page.program.manage-aidworkers.column-email',
      ),
      draggable: false,
      resizeable: false,
    },
    {
      prop: 'created',
      name: this.translate.instant(
        'page.program.manage-aidworkers.column-created',
      ),
      draggable: false,
      resizeable: false,
    },
    {
      prop: 'delete',
      name: this.translate.instant(
        'page.program.manage-aidworkers.column-delete',
      ),
      draggable: false,
      resizeable: false,
      sortable: false,
    },
  ];
  public aidworkers: any[];
  private countryId: number;

  public tableMessages: any;
  private locale: string;
  private dateFormat = 'yyyy-MM-dd, hh:mm';

  constructor(
    public translate: TranslateService,
    private programsService: ProgramsServiceApiService,
    private alertController: AlertController,
  ) {
    this.locale = this.translate.getBrowserCultureLang();
  }

  ngOnInit() {
    this.loadData();
  }

  public async loadData() {
    const program = await this.programsService.getProgramById(this.programId);
    this.countryId = program.countryId;
    this.aidworkers = program.aidworkers;

    this.aidworkers.forEach((aidworker) => {
      aidworker.email = aidworker.email;
      aidworker.created = formatDate(
        aidworker.created,
        this.dateFormat,
        this.locale,
      );
    });
  }

  public async deleteAidworker(row) {
    await this.programsService.deleteUser(row.id);
    this.loadData();
  }

  public async addAidworker() {
    const status = 'active';

    this.programsService
      .addUser(
        this.emailAidworker,
        this.passwordAidworker,
        UserRole.Aidworker,
        status,
        this.countryId,
      )
      .then(
        (res) => {
          this.succesCreatedAidworker(res.user.id);
        },
        (err) => {
          let message;
          if (err.error.message[0] && err.error.message[0].constraints) {
            message = String(
              Object.values(err.error.message[0].constraints)[0],
            );
          } else if (err.error.errors) {
            message = String(Object.values(err.error.errors));
          } else {
            message = this.translate.instant('common.unknown-error');
          }
          this.actionResult(message);
        },
      );
  }

  private async succesCreatedAidworker(userId: number) {
    await this.programsService.assignAidworker(this.programId, userId);
    this.loadData();
    const message = this.translate.instant(
      'page.program.manage-aidworkers.succes-create',
      {
        email: this.emailAidworker,
        password: this.passwordAidworker,
      },
    );
    this.actionResult(message);
    this.emailAidworker = undefined;
    this.passwordAidworker = undefined;
  }

  private async actionResult(resultMessage: string) {
    const alert = await this.alertController.create({
      message: resultMessage,
      buttons: [this.translate.instant('common.ok')],
    });

    await alert.present();
  }
}
