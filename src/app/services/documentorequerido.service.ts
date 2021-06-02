import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { DocumentoReporte, DocumentoRequerido } from '../model/documentoRequerido';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DocumentorequeridoService {


  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  url = environment.base_Url1;

  /** GET documentorequeridos from the server */
  getDocumentoRequeridos(): Observable<DocumentoRequerido[]> {
    return this.http.get<DocumentoRequerido[]>(this.url + '/getdocumentorequerido')
      .pipe(
        tap(_ => this.log('fetched documentorequeridos')),
        catchError(this.handleError('getDocumentoRequeridos', []))
      );
  }
  /** GET documentorequeridos from the server */
  getDocumentoRequeridosReporte(): Observable<DocumentoReporte[]> {
    return this.http.get<DocumentoReporte[]>(this.url + '/reportedocumentos')
      .pipe(
        tap(_ => this.log('fetched documentorequeridos')),
        catchError(this.handleError('getDocumentoRequeridos', []))
      );
  }
  /** GET documentorequeridos from the server */
  getDocumentoRequeridosbyPrestador(IDPrestador: number): Observable<DocumentoRequerido[]> {
    return this.http.get<DocumentoRequerido[]>(this.url + '/getdocumentosbyidprestador?IDPrestador=' + IDPrestador)
      .pipe(
        tap(_ => this.log('fetched documentorequeridos')),
        catchError(this.handleError('getDocumentoRequeridos', []))
      );
  }

  getDocumentoRequeridosFilter(term: String): Observable<DocumentoRequerido[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<DocumentoRequerido[]>(this.url + 'DocumentoRequeridosQ.php', { params: { 'comando': 'query1', 'where': 'and documentorequerido_tipo like "%' + term + '%"' } })
      .pipe(
        tap(_ => this.log('fetched documentorequeridos')),
        catchError(this.handleError('getDocumentoRequeridos', []))
      );
  }

  /** GET documentorequerido by id. Return `undefined` when id not found */
  getDocumentoRequeridoNo404<Data>(id: number): Observable<DocumentoRequerido> {
    const url = `${ this.url }/?id=${id}`;
    return this.http.get<DocumentoRequerido[]>(url)
      .pipe(
        map(documentorequeridos => documentorequeridos[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} documentorequerido id=${id}`);
        }),
        catchError(this.handleError<DocumentoRequerido>(`getDocumentoRequerido id=${id}`))
      );
  }

  /** GET documentorequerido by id. Will 404 if id not found */
  getDocumentoRequerido(id: number): Observable<DocumentoRequerido> {
    // const url = `${this.documentorequeridosUrl}/${id}`;
    return this.http.get<DocumentoRequerido>(this.url + 'DocumentoRequeridosQ.php?comando=queryById&where= and id_documentorequerido_tipo=' + id).pipe(
      tap(_ => this.log(`fetched documentorequerido id=${id}`)),
      catchError(this.handleError<DocumentoRequerido>(`getDocumentoRequerido id=${id}`))
    );
  }

  /* GET documentorequeridos whose name contains search term */
  searchDocumentoRequeridos(term: string): Observable<DocumentoRequerido[]> {
    if (!term.trim()) {
      // if not search term, return empty documentorequerido array.
      return of([]);
    }
    return this.http.get<DocumentoRequerido[]>(`${this.url}/?name=${term}`).pipe(
      tap(_ => this.log(`found documentorequeridos matching "${term}"`)),
      catchError(this.handleError<DocumentoRequerido[]>('searchDocumentoRequeridos', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new documentorequerido to the server */
  addDocumentoRequerido(documentorequerido: DocumentoRequerido): Observable<DocumentoRequerido> {
    return this.http.post<DocumentoRequerido>(this.url + '/insertdocumentorequerido', JSON.stringify(documentorequerido)).pipe(
      tap((newDocumentoRequerido: DocumentoRequerido) => this.log(`added documentorequerido w/ id=${newDocumentoRequerido.IDDocumentoRequerido}`)),
      catchError(this.handleError<DocumentoRequerido>('addDocumentoRequerido'))
    );
  }



  /** PUT: update the documentorequerido on the server */
  updateDocumentoRequerido(documentorequerido: DocumentoRequerido): Observable<any> {
    return this.http.put( this.url + '/updatedocumentorequerido', JSON.stringify(documentorequerido), httpOptions
    ).pipe(
      tap(_ => this.log(`updated documentorequerido id=${documentorequerido.IDDocumentoRequerido}`)),
      catchError(this.handleError<any>('updateDocumentoRequerido'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a DocumentoRequeridoService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`DocumentoRequeridoService: ${message}`);
  }
}
