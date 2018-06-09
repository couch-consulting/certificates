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

  certifier: string;
  certificant: string;
  laudatio: string;
  certificationDate: string;
  certificationPlace: string;
  additionalInputs = [];

  test: HTMLObjectElement;

  constructor(private route: ActivatedRoute,
              private certfdataService: CertfdataService,
              private location: Location) {
    }

  ngOnInit() {
    this.getCertfdata();
    this.certifier = '';
    this.certificant = '';
    this.laudatio = '';
    this.certificationDate = '';
    this.certificationPlace = '';
    //TODO function for addtional inputs


    this.addMarkup();
  }



  getCertfdata(): void {
    const templateId = this.route.snapshot.paramMap.get('templateId');

    this.certfdataService.getCertf(templateId).subscribe(previewCertf => this.previewCertf = previewCertf);

  }


  goBack(): void {
    this.location.back();
  }

  onKey(event: any, input: string) {
    switch(input) {
      case 'certifier':
        this.certifier = event.target.value;
        break;
      case 'certificant':
        this.certificant = event.target.value;
        break;
      case 'laudatio':
        this.laudatio = event.target.value;
        break;
      case 'certificationDate':
        this.certificationDate = event.target.value;
        break;
      case 'certificationPlace':
        this.certificationPlace = event.target.value;
        break;
      default:
       //TODO für additonal input
    }

  }


  update(event: any){
    this.certificationDate = (<Date>event).toLocaleDateString();
  }

  addMarkup(){
    let el = document.createElement( 'div' );
    el.innerHTML = this.previewCertf.previewHTML;
    document.getElementById("1").appendChild(el);
  }
}

