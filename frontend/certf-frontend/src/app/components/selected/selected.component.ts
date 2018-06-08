import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {CertfdataService} from "../../services/certfdata.service";
import {PreviewCertf} from "../../classes/preview-certf";
import {PreviewCertfData} from "../../classes/preview-certf_Data";


@Component({
  selector: 'app-selected',
  templateUrl: './selected.component.html',
  styleUrls: ['./selected.component.css']
})
export class SelectedComponent implements OnInit {
  previewCertf: PreviewCertf;

  constructor(private route: ActivatedRoute,
              private certfdataService: CertfdataService,
              private location: Location) {

  }

  ngOnInit() {
    this.getCertfdata();

  }



  getCertfdata(): void {
    const templateId = this.route.snapshot.paramMap.get('templateId');

    this.certfdataService.getCertf(templateId).subscribe(previewCertf => this.previewCertf = previewCertf);

  }


  goBack(): void {
    this.location.back();
  }
}
