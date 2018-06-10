import {browser, by, element} from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getHomePage() {
    return element(by.css('app-home h1')).getText();
  }


  getMgmtButton() {
    return element(by.css('[routerlink="management"]'));
  }

  getMgmtPage() {
    return element(by.css('[class="button mat-raised-button mat-accent"]'));
  }


  getHomeButton() {
    return element(by.css('app-root mat-icon'));

  }

  getCertfButton() {
    return element(by.css('[routerlink="/certificates"]'));

  }

  navigateToCertf() {
    return browser.get('/certificates');
  }

  getfirstCardCertf() {
    return element(by.css('app-content-card mat-card button'));
  }

  getfirstCardSelected() {
    return element(by.css('app-selected mat-card mat-card-title'));
  }


  navigateToMgmt() {
    return browser.get('/management');
  }

  getPopUpCreate() {
    return element(by.css('mat-dialog-container dialogcreate h1'));
  }


  getfirstCardMgmt() {
    return element(by.css('[class="button mat-raised-button mat-primary"]'));
  }

  getfirstCardChange() {
    return element(by.css('app-change mat-card mat-card-title'));
  }
}
