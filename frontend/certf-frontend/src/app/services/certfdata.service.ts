import { Injectable } from '@angular/core';
/* Mock Data */
import {PreviewCertf} from '../classes/preview-certf';
import {MOCKPREVIEW} from '../classes/mock-previewCertf';
import { Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';


@Injectable()
export class CertfdataService {

  constructor() { }

  getHeroes(): Observable<PreviewCertf[]> {
    return of(MOCKPREVIEW);
  }

}
