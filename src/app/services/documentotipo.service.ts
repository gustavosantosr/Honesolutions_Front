import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { DocumentoTipo } from '../model/documentoTipo';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DocumentotipoService {


  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  url = environment.base_Url1;

  /** GET documentotipos from the server */
  getDocumentoTipos(): Observable<DocumentoTipo[]> {
    return this.http.get<DocumentoTipo[]>(this.url + '/getdocumentotipo')
      .pipe(
        tap(_ => this.log('fetched documentotipos')),
        catchError(this.handleError('getDocumentoTipos', []))
      );
  }

  getDocumentoTiposFilter(term: String): Observable<DocumentoTipo[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<DocumentoTipo[]>(this.url + 'DocumentoTiposQ.php', { params: { 'comando': 'query1', 'where': 'and documentotipo_tipo like "%' + term + '%"' } })
      .pipe(
        tap(_ => this.log('fetched documentotipos')),
        catchError(this.handleError('getDocumentoTipos', []))
      );
  }

  /** GET documentotipo by id. Return `undefined` when id not found */
  getDocumentoTipoNo404<Data>(id: number): Observable<DocumentoTipo> {
    const url = `${ this.url }/?id=${id}`;
    return this.http.get<DocumentoTipo[]>(url)
      .pipe(
        map(documentotipos => documentotipos[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} documentotipo id=${id}`);
        }),
        catchError(this.handleError<DocumentoTipo>(`getDocumentoTipo id=${id}`))
      );
  }

  /** GET documentotipo by id. Will 404 if id not found */
  getDocumentoTipo(id: number): Observable<DocumentoTipo> {
    // const url = `${this.documentotiposUrl}/${id}`;
    return this.http.get<DocumentoTipo>(this.url + 'DocumentoTiposQ.php?comando=queryById&where= and id_documentotipo_tipo=' + id).pipe(
      tap(_ => this.log(`fetched documentotipo id=${id}`)),
      catchError(this.handleError<DocumentoTipo>(`getDocumentoTipo id=${id}`))
    );
  }

  /* GET documentotipos whose name contains search term */
  searchDocumentoTipos(term: string): Observable<DocumentoTipo[]> {
    if (!term.trim()) {
      // if not search term, return empty documentotipo array.
      return of([]);
    }
    return this.http.get<DocumentoTipo[]>(`${this.url}/?name=${term}`).pipe(
      tap(_ => this.log(`found documentotipos matching "${term}"`)),
      catchError(this.handleError<DocumentoTipo[]>('searchDocumentoTipos', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new documentotipo to the server */
  addDocumentoTipo(documentotipo: DocumentoTipo): Observable<DocumentoTipo> {
    return this.http.post<DocumentoTipo>(this.url + '/insertdocumentotipo', JSON.stringify(documentotipo)).pipe(
      tap((newDocumentoTipo: DocumentoTipo) => this.log(`added documentotipo w/ id=${newDocumentoTipo.IDDocumentoTipo}`)),
      catchError(this.handleError<DocumentoTipo>('addDocumentoTipo'))
    );
  }



  /** PUT: update the documentotipo on the server */
  updateDocumentoTipo(documentotipo: DocumentoTipo): Observable<any> {
    return this.http.put( this.url + '/updatedocumentotipo', JSON.stringify(documentotipo), httpOptions
    ).pipe(
      tap(_ => this.log(`updated documentotipo id=${documentotipo.IDDocumentoTipo}`)),
      catchError(this.handleError<any>('updateDocumentoTipo'))
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

  /** Log a DocumentoTipoService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`DocumentoTipoService: ${message}`);
  }
}


