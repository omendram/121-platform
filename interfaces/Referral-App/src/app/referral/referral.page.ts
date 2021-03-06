import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { HelpPage } from 'src/app/help/help.page';
import mockReferralPageData from 'src/app/mocks/referral-page-data.mock';
import { Category } from 'src/app/models/category.model';
import { AnalyticsEventName } from 'src/app/models/event-name.model';
import { Offer } from 'src/app/models/offer.model';
import { ReferralPageData } from 'src/app/models/referral-page-data';
import { SubCategory } from 'src/app/models/sub-category.model';
import { LoggingService } from 'src/app/services/logging.service';
import { OffersService } from 'src/app/services/offers.service';
import { ReferralPageDataService } from 'src/app/services/referral-page-data.service';

@Component({
  selector: 'app-referral',
  templateUrl: 'referral.page.html',
  styleUrls: ['referral.page.scss'],
})
export class ReferralPage {
  public offers: Offer[];
  public categories: Category[];
  public subCategories: SubCategory[];

  public category: Category;
  public subCategory: SubCategory;
  public offer: Offer;

  public referralPageData: ReferralPageData = mockReferralPageData;

  constructor(
    public offersService: OffersService,
    private route: ActivatedRoute,
    private router: Router,
    public modalController: ModalController,
    private loggingService: LoggingService,
    private referralPageDataService: ReferralPageDataService,
  ) {
    this.loadReferralData();
  }

  private loadReferralData() {
    this.referralPageDataService
      .getReferralPageData()
      .then((referralPageData) => {
        this.referralPageData = referralPageData;
        console.log(this.referralPageData);
        this.offersService.getCategories().then((categories) => {
          this.categories = categories;
          this.offersService.getSubCategories().then((subCategories) => {
            this.subCategories = subCategories;
            this.offersService.getOffers().then((offers) => {
              this.offers = offers;
              this.readQueryParams();
            });
          });
        });
      });
  }

  private readQueryParams() {
    this.route.queryParams.subscribe((params) => {
      if ('categoryID' in params) {
        this.category = this.categories.find(
          (category) => category.categoryID === Number(params.categoryID),
        );
      }
      if ('subCategoryID' in params) {
        this.subCategory = this.subCategories.find(
          (subCategory) =>
            subCategory.subCategoryID === Number(params.subCategoryID),
        );
      }
      if ('offerID' in params) {
        this.offer = this.offers.find(
          (offer) => offer.offerID === Number(params.offerID),
        );
      }
    });
  }

  public clickCategory(category: Category, isBack: boolean = false) {
    this.category = category;
    this.subCategory = null;
    this.offer = null;
    this.loggingService.logEvent(
      AnalyticsEventName.ReferralCategoryClick,
      this.getLogProperties(isBack),
    );
    this.router.navigate(['/tabs/referral'], {
      queryParams: {
        categoryID: this.category.categoryID,
      },
    });
  }

  public clickSubCategory(subCategory: SubCategory, isBack: boolean = false) {
    this.subCategory = subCategory;
    this.offer = null;
    this.loggingService.logEvent(
      AnalyticsEventName.ReferralSubCategoryClick,
      this.getLogProperties(isBack),
    );
    this.router.navigate(['/tabs/referral'], {
      queryParams: {
        categoryID: this.category.categoryID,
        subCategoryID: this.subCategory.subCategoryID,
      },
    });
  }

  public clickOffer(offer: Offer, isBack: boolean = false) {
    this.offer = offer;
    this.loggingService.logEvent(
      AnalyticsEventName.ReferralOfferClick,
      this.getLogProperties(isBack),
    );
    this.router.navigate(['/tabs/referral'], {
      queryParams: {
        categoryID: this.category.categoryID,
        subCategoryID: this.subCategory.subCategoryID,
        offerID: this.offer.offerID,
      },
    });
  }

  goBack() {
    if (this.offer) {
      this.loggingService.logEvent(
        AnalyticsEventName.ReferralBackFromOffer,
        this.getLogProperties(true),
      );
      this.clickSubCategory(this.subCategory, true);
    } else if (this.subCategory) {
      this.loggingService.logEvent(
        AnalyticsEventName.ReferralBackFromSubCategory,
        this.getLogProperties(true),
      );
      this.clickCategory(this.category);
    } else if (this.category) {
      this.loggingService.logEvent(
        AnalyticsEventName.ReferralBackFromCategory,
        this.getLogProperties(true),
      );
      this.category = null;
      this.router.navigate(['/tabs/referral']);
    }
  }

  getLogProperties(isBack: boolean) {
    const logParams: { [key: string]: any } = { isBack };
    if (this.offer) {
      logParams.offerName = this.offer.offerName;
    }
    if (this.subCategory) {
      logParams.subCategory = this.subCategory.subCategoryName;
    }
    if (this.category) {
      logParams.category = this.category.categoryName;
    }
    return logParams;
  }

  async openHelpModal() {
    this.loggingService.logEvent(
      AnalyticsEventName.ReferralHelpPageOpen,
      this.getLogProperties(false),
    );
    const helpModal = await this.modalController.create({
      component: HelpPage,
    });
    return await helpModal.present();
  }
}
