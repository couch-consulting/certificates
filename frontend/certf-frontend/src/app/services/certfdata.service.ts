import { Injectable } from '@angular/core';
/* Mock Data */
import {PreviewCertf} from '../classes/preview-certf';
import {MOCKPREVIEW} from '../classes/mock-previewCertf';
import { Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {PreviewCertfData} from "../classes/preview-certf_Data";


@Injectable()
export class CertfdataService {

  constructor() { }

  getCertfs(): Observable<PreviewCertf[]> {
    return of(MOCKPREVIEW);
  }


  getCertf(templateId: string): Observable<PreviewCertf> {
    return of(MOCKPREVIEW.find(previewCertf => previewCertf.templateId === templateId));
  }

}

//TODO rework with GET request for each
