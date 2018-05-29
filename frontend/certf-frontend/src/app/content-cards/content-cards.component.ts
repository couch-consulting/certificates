import { Component, OnInit } from '@angular/core';
import {PreviewCertf} from '../classes/preview-certf';
import {MOCKPREVIEW} from '../classes/mock-previewCertf';

@Component({
  selector: 'app-content-card',
  templateUrl: './content-cards.component.html',
  styleUrls: ['./content-cards.component.css']
})
export class ContentCardsComponent implements OnInit {
  previewCertfs = MOCKPREVIEW;

  //TODO: flex warp für tob bar, max + min height für windows

  constructor() { }

  ngOnInit() {
  }

    chooseCertificate(previewCertf) {
    console.log('' + previewCertf.name);
  }
}
