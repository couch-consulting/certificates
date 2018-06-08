import {Component, OnInit} from '@angular/core';
import {PreviewCertf} from '../classes/preview-certf';
import {CertfdataService} from '../services/certfdata.service';

@Component({
  selector: 'app-content-card',
  templateUrl: './content-cards.component.html',
  styleUrls: ['./content-cards.component.css']
})
export class ContentCardsComponent implements OnInit {
  previewCertfs: PreviewCertf[];

  constructor(private certfdataService: CertfdataService) { }

  ngOnInit() {
    this.getCertfdata();
  }



  getCertfdata(): void {
    this.certfdataService.getCertfs().subscribe(previewCertfs => this.previewCertfs = previewCertfs);
  }

}
