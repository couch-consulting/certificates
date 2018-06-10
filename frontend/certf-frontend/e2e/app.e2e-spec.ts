import {AppPage} from './app.po';


describe('certf-frontend App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display Homepage H1 message', () => {
    page.navigateTo();
    expect(page.getHomePage()).toEqual('Create extremely serious certificates and download them today!');
  });

  it('should display mgmt button', () => {
    page.navigateTo();
    expect(page.getMgmtButton().getText()).toEqual('Mgmt');
  });

  it('should route to mgmt page', () => {
    page.navigateTo();
    page.getMgmtButton().click();
    expect(page.getMgmtPage().getText()).toEqual('Create new Certificate.');
  });


  it('should display home button', () => {
    page.navigateTo();

    expect(page.getHomeButton().getText()).toEqual('home');
  });

  it('should route to home page', () => {
    page.navigateTo();
    page.getHomeButton().click();
    expect(page.getHomePage()).toEqual('Create extremely serious certificates and download them today!');
  });

  it('should display certf button', () => {
    page.navigateTo();
    expect(page.getCertfButton().getText()).toEqual('Start creating the most serious certificates!');
  });

  it('should have object on certf page', () => {
    page.navigateToCertf();

    expect(page.getfirstCardCertf().getText()).toEqual('Use this!');


  });


  //TODO Rest machen wenn server wieder geht (bis 10 - für jede seite 1)


});
