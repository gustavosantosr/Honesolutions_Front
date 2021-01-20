import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Despacho } from '../model/despacho';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DespachoService {


  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  url = environment.base_Url1;

  /** GET despachos from the server */
  getDespachos(): Observable<Despacho[]> {
    return this.http.get<Despacho[]>(this.url + '/getdespacho')
      .pipe(
        tap(_ => this.log('fetched despachos')),
        catchError(this.handleError('getDespachos', []))
      );
  }
  /** GET despachos from the server */
  getDespachoActivos(): Observable<Despacho[]> {
    return this.http.get<Despacho[]>(this.url + '/getdespachoactivo')
      .pipe(
        tap(_ => this.log('fetched despachos')),
        catchError(this.handleError('getDespachos', []))
      );
  }

  getDespachosFilter(term: String): Observable<Despacho[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<Despacho[]>(this.url + 'DespachosQ.php', { params: { 'comando': 'query1', 'where': 'and despacho_tipo like "%' + term + '%"' } })
      .pipe(
        tap(_ => this.log('fetched despachos')),
        catchError(this.handleError('getDespachos', []))
      );
  }

  /** GET despacho by id. Return `undefined` when id not found */
  getDespachoNo404<Data>(id: number): Observable<Despacho> {
    const url = `${ this.url }/?id=${id}`;
    return this.http.get<Despacho[]>(url)
      .pipe(
        map(despachos => despachos[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} despacho id=${id}`);
        }),
        catchError(this.handleError<Despacho>(`getDespacho id=${id}`))
      );
  }

  /** GET despacho by id. Will 404 if id not found */
  getDespacho(id: number): Observable<Despacho> {
    // const url = `${this.despachosUrl}/${id}`;
    return this.http.get<Despacho>(this.url + 'DespachosQ.php?comando=queryById&where= and id_despacho_tipo=' + id).pipe(
      tap(_ => this.log(`fetched despacho id=${id}`)),
      catchError(this.handleError<Despacho>(`getDespacho id=${id}`))
    );
  }

  /* GET despachos whose name contains search term */
  searchDespachos(term: string): Observable<Despacho[]> {
    if (!term.trim()) {
      // if not search term, return empty despacho array.
      return of([]);
    }
    return this.http.get<Despacho[]>(`${this.url}/?name=${term}`).pipe(
      tap(_ => this.log(`found despachos matching "${term}"`)),
      catchError(this.handleError<Despacho[]>('searchDespachos', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new despacho to the server */
  addDespacho(despacho: Despacho): Observable<Despacho> {
    return this.http.post<Despacho>(this.url + '/insertdespacho', JSON.stringify(despacho), httpOptions).pipe(
      tap((newDespacho: Despacho) => this.log(`added despacho w/ id=${newDespacho.IDDespacho}`)),
      catchError(this.handleError<Despacho>('addDespacho'))
    );
  }



  /** PUT: update the despacho on the server */
  updateDespacho(despacho: Despacho): Observable<any> {
    return this.http.put( this.url + '/updatedespacho', JSON.stringify(despacho), httpOptions
    ).pipe(
      tap(_ => this.log(`updated despacho id=${despacho.IDDespacho}`)),
      catchError(this.handleError<any>('updateDespacho'))
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

  /** Log a DespachoService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`DespachoService: ${message}`);
  }
}

