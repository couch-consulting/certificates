import {Component, Inject, OnInit} from '@angular/core';
import {PreviewCertfMgmt} from '../../classes/preview-certf_mgmt';
import {CertfdataService} from '../../services/certfdata.service';
import {Observable} from "rxjs/Observable";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-mgmt',
  templateUrl: './mgmt.component.html',
  styleUrls: ['./mgmt.component.css']
})
export class MgmtComponent implements OnInit {
  previewCertfsMgmt: Observable<PreviewCertfMgmt[]>;
  previewCertfMgmt: PreviewCertfMgmt;
  result: PreviewCertfMgmt;
  postBody: {};
  loading2: boolean;

  constructor(private certfdataService: CertfdataService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    //Get all Certfs
    this.previewCertfsMgmt = this.certfdataService.getCertfsMgmt();

    this.loading2 = false;
    //response object
    this.postBody = {};
    this.previewCertfMgmt = <PreviewCertfMgmt>{};
    this.previewCertfMgmt['name'] = '';
    this.previewCertfMgmt['description'] = '';
    this.previewCertfMgmt['inputFields'] = [];
    this.previewCertfMgmt['previewHTML'] = '';
    this.previewCertfMgmt['previewImage'] = '';

  }


  /**
   * Change Dialog Window Opener
   */
  openDialog_create(): void {
    let dialogRef = this.dialog.open(DialogCreate, {
      width: '75%',
      data: {previewCertfMgmt: this.previewCertfMgmt}
    });

    dialogRef.afterClosed().subscribe(
      result => this.result = result,
      error => console.log("Error: ", error),
      () => this.postCertfData(this.result));
  }

  /**
   * Create certf
   */
  postCertfData(postBody) {
    if (typeof this.result !== 'undefined' && this.result.name !== '' && this.result.description !== '' && this.result.inputFields !== []
      && this.result.previewHTML !== '') {
      this.postBody['name'] = this.result.name;
      this.postBody['description'] = this.result.description;

      this.postBody['inputFields'] = this.result.inputFields.toString().replace(/ /g, '').split(",");

      this.postBody['previewHTML'] = this.result.previewHTML;
      this.postBody['previewImage'] = this.result.previewImage;


      this.loading2 = true;

      this.certfdataService.postCertfMgmt(this.postBody).subscribe(
        p => p,
        error => {
          console.log("Error: ", error);
          this.loading2 = false;
        },
        () => this.reload());


    }
  }

  /**
   * stops progress spinenr and reloads certf view
   */
  reload() {
    this.loading2 = false;
    this.previewCertfsMgmt = this.certfdataService.getCertfsMgmt();
  }

}


/**
 * Dialog Window Component
 */
@Component({
  selector: 'dialogCreate',
  templateUrl: 'dialogCreate.html',
})
export class DialogCreate {

  constructor(public dialogRef: MatDialogRef<DialogCreate>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
