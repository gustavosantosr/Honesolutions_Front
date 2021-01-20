import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Zonal } from '../model/zonal';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ZonalService {


  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  url = environment.base_Url1;

  /** GET zonales from the server */
  getZonales(): Observable<Zonal[]> {
    return this.http.get<Zonal[]>(this.url + '/getzonal')
      .pipe(
        tap(_ => this.log('fetched zonales')),
        catchError(this.handleError('getZonales', []))
      );
  }

  getZonalesFilter(term: String): Observable<Zonal[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<Zonal[]>(this.url + 'ZonalesQ.php', { params: { 'comando': 'query1', 'where': 'and zonal_tipo like "%' + term + '%"' } })
      .pipe(
        tap(_ => this.log('fetched zonales')),
        catchError(this.handleError('getZonales', []))
      );
  }

  /** GET zonal by id. Return `undefined` when id not found */
  getZonalNo404<Data>(id: number): Observable<Zonal> {
    const url = `${ this.url }/?id=${id}`;
    return this.http.get<Zonal[]>(url)
      .pipe(
        map(zonales => zonales[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} zonal id=${id}`);
        }),
        catchError(this.handleError<Zonal>(`getZonal id=${id}`))
      );
  }

  /** GET zonal by id. Will 404 if id not found */
  getZonal(id: number): Observable<Zonal> {
    // const url = `${this.zonalesUrl}/${id}`;
    return this.http.get<Zonal>(this.url + 'ZonalesQ.php?comando=queryById&where= and id_zonal_tipo=' + id).pipe(
      tap(_ => this.log(`fetched zonal id=${id}`)),
      catchError(this.handleError<Zonal>(`getZonal id=${id}`))
    );
  }

  /* GET zonales whose name contains search term */
  searchZonales(term: string): Observable<Zonal[]> {
    if (!term.trim()) {
      // if not search term, return empty zonal array.
      return of([]);
    }
    return this.http.get<Zonal[]>(`${this.url}/?name=${term}`).pipe(
      tap(_ => this.log(`found zonales matching "${term}"`)),
      catchError(this.handleError<Zonal[]>('searchZonales', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new zonal to the server */
  addZonal(zonal: Zonal): Observable<Zonal> {
    return this.http.post<Zonal>(this.url + '/insertzonal', JSON.stringify(zonal)).pipe(
      tap((newZonal: Zonal) => this.log(`added zonal w/ id=${newZonal.IDZonal}`)),
      catchError(this.handleError<Zonal>('addZonal'))
    );
  }



  /** PUT: update the zonal on the server */
  updateZonal(zonal: Zonal): Observable<any> {
    return this.http.put( this.url + '/updatezonal', JSON.stringify(zonal), httpOptions
    ).pipe(
      tap(_ => this.log(`updated zonal id=${zonal.IDZonal}`)),
      catchError(this.handleError<any>('updateZonal'))
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

  /** Log a ZonalService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`ZonalService: ${message}`);
  }
}
