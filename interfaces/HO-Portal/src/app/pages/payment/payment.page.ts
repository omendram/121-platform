import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ProgramPhase } from 'src/app/models/program.model';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  public programId = this.route.snapshot.params.id;
  public thisPhase = ProgramPhase.payment;
  public isReady: boolean;

  public userRole = this.authService.getUserRole();

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {}

  ngOnInit() {}

  public onReady(state: boolean) {
    this.isReady = state;
  }
}
