import {CertfdataService} from './certfdata.service';
import {inject} from '@angular/core/testing';


xdescribe('CertfdataService', () => {


  it('CertfDataSerivce should be created', inject([CertfdataService], (service: CertfdataService) => {
    expect(service).toBeTruthy();

  }));

  it('should have getCertfMgmt function', inject([CertfdataService], (service: CertfdataService) => {
    expect(service.getCertfMgmt).toBeTruthy();

  }));

  it('should have postCertfMgmt function', inject([CertfdataService], (service: CertfdataService) => {
    expect(service.postCertfMgmt).toBeTruthy();

  }));
  it('should have putCertfMgmt function', inject([CertfdataService], (service: CertfdataService) => {
    expect(service.putCertfMgmt).toBeTruthy();

  }));

  it('should have getCertfs function', inject([CertfdataService], (service: CertfdataService) => {
    expect(service.getCertfs).toBeTruthy();

  }));


  it('should have getCertfs function', inject([CertfdataService], (service: CertfdataService) => {
    expect(service.postCertf).toBeTruthy();

  }));

});
