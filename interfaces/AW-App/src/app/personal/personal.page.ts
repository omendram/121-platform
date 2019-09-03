import { Component, ViewChild, OnInit, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { environment } from 'src/environments/environment';

import { ProgramsServiceApiService } from '../services/programs-service-api.service';
import { ConversationService } from '../services/conversation.service';

@Component({
  selector: 'app-personal',
  templateUrl: 'personal.page.html',
  styleUrls: ['personal.page.scss'],
})
export class PersonalPage implements OnInit {
  @ViewChild(IonContent)
  public ionContent: IonContent;

  @ViewChild('conversationContainer', { read: ViewContainerRef })
  public container;

  public isDebug: boolean = !environment.production;

  constructor(
    public programsService: ProgramsServiceApiService,
    private conversationService: ConversationService,
    private resolver: ComponentFactoryResolver
  ) { }

  ngOnInit() {
    this.loadComponents();
  }

  ionViewDidEnter() {
    this.scrollDown();
  }

  private loadComponents() {
    const steps = this.conversationService.getComponents();

    for (const step of steps) {
      const factory = this.resolver.resolveComponentFactory(step.component);
      this.container.createComponent(factory);
    }
  }

  scrollDown() {
    // Wait for elements to be added to the DOM before scrolling down
    setTimeout(() => {
      this.ionContent.scrollToBottom(300);
    }, 100);
  }
}