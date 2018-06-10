import {Component, OnInit} from '@angular/core';
import {PreviewCertf} from '../classes/preview-certf';
import {CertfdataService} from '../services/certfdata.service';
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-content-card',
  templateUrl: './content-cards.component.html',
  styleUrls: ['./content-cards.component.css']
})
export class ContentCardsComponent implements OnInit {
  previewCertfs: Observable<PreviewCertf[]>;

  constructor(private certfdataService: CertfdataService) { }

  ngOnInit() {
    //Get all Certfs
    this.previewCertfs = this.certfdataService.getCertfs();
  }


}
