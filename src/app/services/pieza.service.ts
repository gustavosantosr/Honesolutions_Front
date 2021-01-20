import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Pieza } from '../model/pieza';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PiezaService {


  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  url = environment.base_Url1;

  /** GET piezas from the server */
  getPiezas(): Observable<Pieza[]> {
    return this.http.get<Pieza[]>(this.url + '/getpieza')
      .pipe(
        tap(_ => this.log('fetched piezas')),
        catchError(this.handleError('getPiezas', []))
      );
  }

  getPiezasFilter(term: String): Observable<Pieza[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<Pieza[]>(this.url + 'PiezasQ.php', { params: { 'comando': 'query1', 'where': 'and pieza_tipo like "%' + term + '%"' } })
      .pipe(
        tap(_ => this.log('fetched piezas')),
        catchError(this.handleError('getPiezas', []))
      );
  }

  /** GET pieza by id. Return `undefined` when id not found */
  getPiezaNo404<Data>(id: number): Observable<Pieza> {
    const url = `${ this.url }/?id=${id}`;
    return this.http.get<Pieza[]>(url)
      .pipe(
        map(piezas => piezas[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} pieza id=${id}`);
        }),
        catchError(this.handleError<Pieza>(`getPieza id=${id}`))
      );
  }

  /** GET pieza by id. Will 404 if id not found */
  getPiezasbyCliente(id: number): Observable<Pieza[]> {
    // const url = `${this.piezasUrl}/${id}`;
    return this.http.get<Pieza[]>(this.url + '/getpiezasbycliente?IDCliente=' + id).pipe(
      tap(_ => this.log(`fetched pieza id=${id}`)),
      catchError(this.handleError<Pieza[]>(`getPieza[] id=${id}`))
    );
  }

  /* GET piezas whose name contains search term */
  searchPiezas(term: string): Observable<Pieza[]> {
    if (!term.trim()) {
      // if not search term, return empty pieza array.
      return of([]);
    }
    return this.http.get<Pieza[]>(`${this.url}/?name=${term}`).pipe(
      tap(_ => this.log(`found piezas matching "${term}"`)),
      catchError(this.handleError<Pieza[]>('searchPiezas', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new pieza to the server */
  addPieza(pieza: Pieza): Observable<Pieza> {
    return this.http.post<Pieza>(this.url + '/insertpieza', JSON.stringify(pieza), httpOptions).pipe(
      tap((newPieza: Pieza) => this.log(`added pieza w/ id=${newPieza.IDPieza}`)),
      catchError(this.handleError<Pieza>('addPieza'))
    );
  }



  /** PUT: update the pieza on the server */
  updatePieza(pieza: Pieza): Observable<any> {
    return this.http.put( this.url + '/updatepieza', JSON.stringify(pieza), httpOptions
    ).pipe(
      tap(_ => this.log(`updated pieza id=${pieza.IDPieza}`)),
      catchError(this.handleError<any>('updatePieza'))
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

  /** Log a PiezaService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`PiezaService: ${message}`);
  }
}
