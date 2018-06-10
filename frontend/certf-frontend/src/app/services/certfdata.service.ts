import {Component, Inject, Injectable} from '@angular/core';
import {PreviewCertf} from '../classes/preview-certf';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError, retry} from 'rxjs/operators';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {PreviewCertfMgmt} from "../classes/preview-certf_mgmt";

//HTTP Header Options for Put and POST
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

  /**
   * Get Request for an array of all Templets
   * @returns {Observable<PreviewCertf[]>}
   */
  getCertfs(): Observable<PreviewCertf[]> {
    return this.http.get<PreviewCertf[]>(this.baseUrl + 'templates').pipe(retry(3),
      catchError(this.handleError('getCertfs', []))
    );
  }

  /**
   * Get Request for a specific Templlate
   * @param {string} templateId ID of the template that shall be requested
   * @returns {Observable<PreviewCertf>}
   */
  getCertf(templateId: string): Observable<PreviewCertf> {
    return this.http.get<PreviewCertf>(this.baseUrl + 'templates/' + templateId)
      .pipe(retry(3),
        catchError(this.handleError<any>('getCertf', PreviewCertf))
      );
  }

  /**
   * Post request to generate template id with given data
   * @param body Input values from user
   * @returns {Observable<any>}
   */
  postCertf(body): Observable<any> {
    return this.http.post(this.baseUrl + 'templates', body, httpOptions).pipe(retry(3),
      catchError(this.handleError<any>('postCertf')));

  }

  /** MANAGEMET
   * Post request to generate certf pdf with given data
   * @returns {Observable<any>}
   */
  postGenCertf(templateId: string): Observable<any> {
    return this.http.post(this.baseUrl + 'generateTemplate/' + templateId, {}, httpOptions).pipe(retry(3),
      catchError(this.handleError<any>('postGenCertf')));

  }


  /**
   * Error MSG Dialog Window Opener
   */
  openDialog(): void {
    let dialogRef = this.dialog.open(DialogHTTPError, {
      width: '250px',
      data: {errorMSG: this.errorMSG}
    });
  }

  //Mgmt Stuff
  /** MANAGEMET
   * Get Request for an array of all certfs
   * @returns {Observable<PreviewCertfMgmt[]>}
   */
  getCertfsMgmt(): Observable<PreviewCertfMgmt[]> {
    return this.http.get<PreviewCertfMgmt[]>(this.baseUrl + 'management').pipe(retry(3),
      catchError(this.handleError('getCertfsMgmt', []))
    );
  }

  /** MANAGEMET
   * Get Request for a specific certf
   * @param {string} templateId ID of the template that shall be requested
   * @returns {Observable<PreviewCertf>}
   */
  getCertfMgmt(templateId: string): Observable<PreviewCertfMgmt> {
    return this.http.get<PreviewCertfMgmt>(this.baseUrl + 'management/' + templateId)
      .pipe(retry(3),
        catchError(this.handleError<any>('getCertfMgmt', PreviewCertfMgmt))
      );
  }

  /** MANAGEMET
   * Put request to update certf with given data
   * @param body Input values from user
   * @param templateId
   * @returns {Observable<any>}
   */
  putCertfMgmt(templateId, body): Observable<any> {
    return this.http.put(this.baseUrl + 'management/' + templateId, body, httpOptions).pipe(retry(3),
      catchError(this.handleError<any>('putCertfMgmt')));

  }

  /** MANAGEMET
   * Post request to generate certf id with given data
   * @param body Input values from user
   * @returns {Observable<any>}
   */
  postCertfMgmt(body): Observable<any> {
    return this.http.post(this.baseUrl + 'management', body, httpOptions).pipe(retry(3),
      catchError(this.handleError<any>('postCertfMgmt')));

  }

  /** MANAGEMET
   * Delete Request for a specific certf
   * @param {string} templateId ID of the template that shall be deleted
   * @returns {Observable<any>}
   */
  deleteCertfMgmt(templateId: string): Observable<any> {
    return this.http.delete(this.baseUrl + 'management/' + templateId)
      .pipe(catchError(this.handleError<any>('deleteCertfMgmt'))
      );
  }


  /**
   * HTTP Error Handler
   * @param {string} operation Which operation the error handler called
   * @param {T} result what type the return object should be (for keeping the app alive even after faild call)
   * @returns {(error: HttpErrorResponse) => Observable<T>}
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      //workaround for put error problem
      if (error.status === 200) {
        return of(result as T)
      }

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

/**
 * Dialog Window Component for Errors
 */
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

