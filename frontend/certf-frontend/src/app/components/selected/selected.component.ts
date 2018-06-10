import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {CertfdataService} from "../../services/certfdata.service";
import {PreviewCertf} from "../../classes/preview-certf";
import {FormControl, Validators} from '@angular/forms';
import {Observable} from "rxjs/Observable";


@Component({
  selector: 'app-selected',
  templateUrl: './selected.component.html',
  styleUrls: ['./selected.component.css']
})
export class SelectedComponent implements OnInit {
  previewCertfObs: Observable<PreviewCertf>;
  previewCertf: PreviewCertf;

  newTempletId: string;
  apiurl: string;
  certifier: string;
  certificant: string;
  laudatio: string;
  certificationDate: string;
  certificationPlace: string;

  loading2: boolean;
  pdf: boolean;

  additionalInputs: {};
  userInput: {};

  certifierCtrl: FormControl;
  certificantCtrl: FormControl;
  laudatioCtrl: FormControl;

  constructor(private route: ActivatedRoute,
              private certfdataService: CertfdataService,
              private location: Location) {
  }

  ngOnInit() {
    this.getCertfdata().subscribe(previewCertf => this.gotCertfData(previewCertf));
    this.certifier = '';
    this.certificant = '';
    this.laudatio = '';
    this.certificationDate = '';
    this.certificationPlace = '';
    this.additionalInputs = {};
    this.userInput = {};
    this.loading2 = false;
    this.pdf = false;
    this.apiurl = "https://certification-api.eu-de.mybluemix.net";

    this.certifierCtrl = new FormControl('', [Validators.required]);
    this.certificantCtrl = new FormControl('', [Validators.required]);
    this.laudatioCtrl = new FormControl('', [Validators.required]);

    //let reg = /([0]?[1-9]|[1][0-2])\/([0]?[1-9]|[1-2][0-9]|[3][0-1])\/[0-9]{4}/g;
    //Does not work via Validator: Date Validators.pattern('([0]?[1-9]|[1][0-2])\\/([0]?[1-9]|[1-2][0-9]|[3][0-1])\\/[0-9]{4}$')


  }


  getCertfdata() {
    const templateId = this.route.snapshot.paramMap.get('templateId');

    this.previewCertfObs = this.certfdataService.getCertf(templateId);
    return this.previewCertfObs

  }

  gotCertfData(previewCertf): void {
    this.previewCertf = previewCertf;
    this.previewCertf.inputFields.forEach((input) => {
      this.additionalInputs[input] = '';
    })
  }

  goBack(): void {
    this.location.back();
  }

  onKey(event: any, input: string) {
    switch (input) {
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
        this.additionalInputs[input] = event.target.value;

    }

  }


  update(event: any) {
    this.certificationDate = (<Date>event).toLocaleDateString();
  }


  generateCertf(): void {


    if (this.certifier !== '' && this.certificant !== '' && this.laudatio !== '') {
      this.userInput["templateId"] = this.previewCertf.templateId;
      this.userInput["certifier"] = this.certifier;

      this.userInput["certificant"] = this.certificant;

      this.userInput["laudatio"] = this.laudatio;
      this.userInput["certificationDate"] = this.certificationDate;
      this.userInput["certificationPlace"] = this.certificationPlace;
      this.userInput["additionalInputs"] = this.additionalInputs;
      this.loading2 = true;
      this.certfdataService.postCertf(this.userInput).subscribe(
        newTempletId => this.newTempletId = newTempletId,
        error => console.log("Error: ", error),
        () => this.completeCallback());


    }

  }


  completeCallback() {
    this.loading2 = false;
    this.pdf = true;

  }

  openPDF() {
    window.open(this.apiurl + "/certify/" + this.newTempletId['taskId'], "_blank");
  }
}

