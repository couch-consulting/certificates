import { TestBed, inject } from '@angular/core/testing';

import { CertfdataService } from './certfdata.service';

describe('CertfdataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CertfdataService]
    });
  });

  it('should be created', inject([CertfdataService], (service: CertfdataService) => {
    expect(service).toBeTruthy();
  }));
});
