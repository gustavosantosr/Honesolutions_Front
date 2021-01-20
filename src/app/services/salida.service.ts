import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Salida } from '../model/salida';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class SalidaService {


  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  url = environment.base_Url1;

  /** GET salidas from the server */
  getSalidas(): Observable<Salida[]> {
    return this.http.get<Salida[]>(this.url + '/getsalida')
      .pipe(
        tap(_ => this.log('fetched salidas')),
        catchError(this.handleError('getSalidas', []))
      );
  }

  getSalidasFilter(term: String): Observable<Salida[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<Salida[]>(this.url + 'SalidasQ.php', { params: { 'comando': 'query1', 'where': 'and salida_tipo like "%' + term + '%"' } })
      .pipe(
        tap(_ => this.log('fetched salidas')),
        catchError(this.handleError('getSalidas', []))
      );
  }

  /** GET salida by id. Return `undefined` when id not found */
  getSalidaNo404<Data>(id: number): Observable<Salida> {
    const url = `${ this.url }/?id=${id}`;
    return this.http.get<Salida[]>(url)
      .pipe(
        map(salidas => salidas[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} salida id=${id}`);
        }),
        catchError(this.handleError<Salida>(`getSalida id=${id}`))
      );
  }

  /** GET salida by id. Will 404 if id not found */
  getSalida(id: number): Observable<Salida> {
    // const url = `${this.salidasUrl}/${id}`;
    return this.http.get<Salida>(this.url + 'SalidasQ.php?comando=queryById&where= and id_salida_tipo=' + id).pipe(
      tap(_ => this.log(`fetched salida id=${id}`)),
      catchError(this.handleError<Salida>(`getSalida id=${id}`))
    );
  }

  /* GET salidas whose name contains search term */
  searchSalidas(term: string): Observable<Salida[]> {
    if (!term.trim()) {
      // if not search term, return empty salida array.
      return of([]);
    }
    return this.http.get<Salida[]>(`${this.url}/?name=${term}`).pipe(
      tap(_ => this.log(`found salidas matching "${term}"`)),
      catchError(this.handleError<Salida[]>('searchSalidas', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new salida to the server */
  addSalida(salida: Salida): Observable<Salida> {
    return this.http.post<Salida>(this.url + '/insertsalida', JSON.stringify(salida), httpOptions).pipe(
      tap((newSalida: Salida) => this.log(`added salida w/ id=${newSalida.IDSalida}`)),
      catchError(this.handleError<Salida>('addSalida'))
    );
  }



  /** PUT: update the salida on the server */
  updateSalida(salida: Salida): Observable<any> {
    return this.http.put( this.url + '/updatesalida', JSON.stringify(salida), httpOptions
    ).pipe(
      tap(_ => this.log(`updated salida id=${salida.IDSalida}`)),
      catchError(this.handleError<any>('updateSalida'))
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
      // alert(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a SalidaService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`SalidaService: ${message}`);
  }
}


