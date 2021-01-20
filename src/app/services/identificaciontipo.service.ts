import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { IdentificacionTipo } from '../model/identificacionTipo';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class IdentificaciontipoService {


  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  url = environment.base_Url1;

  /** GET identificaciontipos from the server */
  getIdentificacionTipos(): Observable<IdentificacionTipo[]> {
    return this.http.get<IdentificacionTipo[]>(this.url + '/getidentificaciontipo')
      .pipe(
        tap(_ => this.log('fetched identificaciontipos')),
        catchError(this.handleError('getIdentificacionTipos', []))
      );
  }
  /** GET identificaciontipos from the server */
  getIdentificacionTiposActivo(): Observable<IdentificacionTipo[]> {
    return this.http.get<IdentificacionTipo[]>(this.url + '/getidentificaciontipoactivo')
      .pipe(
        tap(_ => this.log('fetched identificaciontipos')),
        catchError(this.handleError('getIdentificacionTipos', []))
      );
  }
  /** GET identificaciontipos from the server */
  getIdentificacionTiposInactivo(): Observable<IdentificacionTipo[]> {
    return this.http.get<IdentificacionTipo[]>(this.url + '/getidentificaciontipoinactivo')
      .pipe(
        tap(_ => this.log('fetched identificaciontipos')),
        catchError(this.handleError('getIdentificacionTipos', []))
      );
  }

  getIdentificacionTiposFilter(term: String): Observable<IdentificacionTipo[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<IdentificacionTipo[]>(this.url + 'IdentificacionTiposQ.php', { params: { 'comando': 'query1', 'where': 'and identificaciontipo_tipo like "%' + term + '%"' } })
      .pipe(
        tap(_ => this.log('fetched identificaciontipos')),
        catchError(this.handleError('getIdentificacionTipos', []))
      );
  }

  /** GET identificaciontipo by id. Return `undefined` when id not found */
  getIdentificacionTipoNo404<Data>(id: number): Observable<IdentificacionTipo> {
    const url = `${ this.url }/?id=${id}`;
    return this.http.get<IdentificacionTipo[]>(url)
      .pipe(
        map(identificaciontipos => identificaciontipos[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} identificaciontipo id=${id}`);
        }),
        catchError(this.handleError<IdentificacionTipo>(`getIdentificacionTipo id=${id}`))
      );
  }

  /** GET identificaciontipo by id. Will 404 if id not found */
  getIdentificacionTipo(id: number): Observable<IdentificacionTipo> {
    // const url = `${this.identificaciontiposUrl}/${id}`;
    return this.http.get<IdentificacionTipo>(this.url + 'IdentificacionTiposQ.php?comando=queryById&where= and id_identificaciontipo_tipo=' + id).pipe(
      tap(_ => this.log(`fetched identificaciontipo id=${id}`)),
      catchError(this.handleError<IdentificacionTipo>(`getIdentificacionTipo id=${id}`))
    );
  }

  /* GET identificaciontipos whose name contains search term */
  searchIdentificacionTipos(term: string): Observable<IdentificacionTipo[]> {
    if (!term.trim()) {
      // if not search term, return empty identificaciontipo array.
      return of([]);
    }
    return this.http.get<IdentificacionTipo[]>(`${this.url}/?name=${term}`).pipe(
      tap(_ => this.log(`found identificaciontipos matching "${term}"`)),
      catchError(this.handleError<IdentificacionTipo[]>('searchIdentificacionTipos', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new identificaciontipo to the server */
  addIdentificacionTipo(identificaciontipo: IdentificacionTipo): Observable<IdentificacionTipo> {
    return this.http.post<IdentificacionTipo>(this.url + '/insertidentificaciontipo', JSON.stringify(identificaciontipo)).pipe(
      tap((newIdentificacionTipo: IdentificacionTipo) => this.log(`added identificaciontipo w/ id=${newIdentificacionTipo.IDIdentificacionTipo}`)),
      catchError(this.handleError<IdentificacionTipo>('addIdentificacionTipo'))
    );
  }



  /** PUT: update the identificaciontipo on the server */
  updateIdentificacionTipo(identificaciontipo: IdentificacionTipo): Observable<any> {
    return this.http.put( this.url + '/updateidentificaciontipo', JSON.stringify(identificaciontipo), httpOptions
    ).pipe(
      tap(_ => this.log(`updated identificaciontipo id=${identificaciontipo.IDIdentificacionTipo}`)),
      catchError(this.handleError<any>('updateIdentificacionTipo'))
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

  /** Log a IdentificacionTipoService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`IdentificacionTipoService: ${message}`);
  }
}


