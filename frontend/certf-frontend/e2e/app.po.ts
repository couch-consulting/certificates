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

  getCertfPage() {
    //TODO machen wenn server wieder geht
  }
}
