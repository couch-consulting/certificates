import {Component, Inject, Injectable} from '@angular/core';
/* Mock Data */
import {PreviewCertf} from '../classes/preview-certf';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError, retry} from 'rxjs/operators';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class CertfdataService {
  errorMSG: string;
  private baseUrl = 'https://certification-api.eu-de.mybluemix.net/';

  constructor(private http: HttpClient,
              public dialog: MatDialog) {
    this.errorMSG = 'Something bad happened. We are seriously sorry!';
  }

  getCertfs(): Observable<PreviewCertf[]> {
    return this.http.get<PreviewCertf[]>(this.baseUrl + 'templates').pipe(retry(3),
      catchError(this.handleError('getCertfs', []))
    );
  }

  getCertf(templateId: string): Observable<PreviewCertf> {
    return this.http.get<PreviewCertf>(this.baseUrl + 'templates/' + templateId)
      .pipe(retry(3),
        catchError(this.handleError<any>('getCertf', PreviewCertf))
      );
  }

  postCertf(body): Observable<any> {
    return this.http.post(this.baseUrl + 'templates', body, httpOptions).pipe(retry(3),
      catchError(this.handleError<any>('postCertf')));

  }

  openDialog(): void {
    let dialogRef = this.dialog.open(DialogHTTPError, {
      width: '250px',
      data: {errorMSG: this.errorMSG}
    });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.log(`${operation} failed!`);
      if (error.error instanceof ErrorEvent) {
        console.error('An error occurred:', error.error.message);
      } else {
        console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error}`);
      }
      this.openDialog();
      return of(result as T)
    }

  }
}

@Component({
  selector: 'dialogHTTPError',
  templateUrl: 'dialogHTTPError.html',
})
export class DialogHTTPError {

  constructor(public dialogRef: MatDialogRef<DialogHTTPError>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}

