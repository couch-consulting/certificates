import {Component, Inject, OnInit} from '@angular/core';
import {PreviewCertfMgmt} from "../../../classes/preview-certf_mgmt";
import {Observable} from "rxjs/Observable";
import {CertfdataService} from "../../../services/certfdata.service";
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from "@angular/material";

@Component({
  selector: 'app-change',
  templateUrl: './change.component.html',
  styleUrls: ['./change.component.css']
})
export class ChangeComponent implements OnInit {
  previewCertfMgmtObs: Observable<PreviewCertfMgmt>;
  previewCertfMgmt: PreviewCertfMgmt;
  result: PreviewCertfMgmt;
  putBody: {};
  loading2: boolean;


  constructor(private route: ActivatedRoute,
              private certfdataService: CertfdataService,
              private location: Location,
              public dialog: MatDialog,
              public snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.getCertfdataMgmt().subscribe(previewCertfMgmt => this.previewCertfMgmt = previewCertfMgmt);
    this.putBody = {};
  }


  /** Mgmt
   * Get Certf data of the selected certf.
   * @returns {Observable<PreviewCertf>}
   */
  getCertfdataMgmt() {
    const templateId = this.route.snapshot.paramMap.get('templateId');

    this.previewCertfMgmtObs = this.certfdataService.getCertfMgmt(templateId);
    return this.previewCertfMgmtObs

  }

  /**
   * goes back to last page
   */
  goBack(): void {
    this.location.back();
  }

  /**
   * Change Dialog Window Opener
   */
  openDialog_change(): void {
    let dialogRef = this.dialog.open(DialogChange, {
      width: '75%',
      data: {previewCertfMgmt: this.previewCertfMgmt}
    });

    dialogRef.afterClosed().subscribe(
      result => this.result = result,
      error => console.log("Error: ", error),
      () => this.putCertfData());
  }


  /**
   * Update Certf
   */
  putCertfData() {
    if (typeof this.result !== 'undefined') {
      this.putBody['name'] = this.result.name;
      this.putBody['description'] = this.result.description;


      this.putBody['inputFields'] = this.result.inputFields.toString().replace(/ /g, '').split(",");


      this.putBody['previewHTML'] = this.result.previewHTML;
      this.putBody['previewImage'] = this.result.previewImage;

      this.loading2 = true;

      this.certfdataService.putCertfMgmt(this.route.snapshot.paramMap.get('templateId'), this.putBody).subscribe(
        p => p,
        error => {
          console.log("Error: ", error);
          this.loading2 = false;
        },
        () => this.openSnackBar());

    }

  }

  /**
   * opens snack bar
   */
  openSnackBar() {
    this.loading2 = false;
    this.snackBar.openFromComponent(PutSnackBar, {
      duration: 2000,
    });
  }

  /**
   * open dialog for delete
   */
  openDialog_delete(): void {
    let dialogRef = this.dialog.open(DialogDelete, {
      width: '75%',
    });

    dialogRef.afterClosed().subscribe(
      result => this.result = result,
      error => console.log("Error: ", error),
      () => this.deleteCertf(this.result));
  }

  /**
   * Deltes Certf
   * @param result boolean if ok button was pressed or not
   */
  deleteCertf(result) {
    if (result === true) {
      this.loading2 = true;
      this.certfdataService.deleteCertfMgmt(this.route.snapshot.paramMap.get('templateId')).subscribe(
        p => p,
        error => {
          console.log("Error: ", error);
          this.loading2 = false;
        },
        () => this.goBack());

    }
  }

}

/**
 * Dialog Window Component for Change
 */
@Component({
  selector: 'dialogChange',
  templateUrl: 'dialogChange.html',
})
export class DialogChange {

  constructor(public dialogRef: MatDialogRef<DialogChange>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

/**
 * snackbar comp.
 */
@Component({
  selector: 'change.component-snack',
  templateUrl: 'change.component-snack.html',
  styles: [`.example-pizza-party {
    color: white;
  }`],
})
export class PutSnackBar {
}


/**
 * Dialog Window Component for Change
 */
@Component({
  selector: 'dialogDelete',
  templateUrl: 'dialogDelete.html',
})
export class DialogDelete {

  constructor(public dialogRef: MatDialogRef<DialogDelete>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
