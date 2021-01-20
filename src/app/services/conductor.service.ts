import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Conductor } from '../model/conductor';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ConductorService {


  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  url = environment.base_Url1;

  /** GET conductores from the server */
  getConductores(): Observable<Conductor[]> {
    return this.http.get<Conductor[]>(this.url + '/getconductor')
      .pipe(
        tap(_ => this.log('fetched conductores')),
        catchError(this.handleError('getConductores', []))
      );
  }

  getConductoresFilter(term: String): Observable<Conductor[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<Conductor[]>(this.url + 'ConductoresQ.php', { params: { 'comando': 'query1', 'where': 'and conductor_tipo like "%' + term + '%"' } })
      .pipe(
        tap(_ => this.log('fetched conductores')),
        catchError(this.handleError('getConductores', []))
      );
  }

  /** GET conductor by id. Return `undefined` when id not found */
  getConductorNo404<Data>(id: number): Observable<Conductor> {
    const url = `${ this.url }/?id=${id}`;
    return this.http.get<Conductor[]>(url)
      .pipe(
        map(conductores => conductores[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} conductor id=${id}`);
        }),
        catchError(this.handleError<Conductor>(`getConductor id=${id}`))
      );
  }

  /** GET conductor by id. Will 404 if id not found */
  getConductor(id: number): Observable<Conductor> {
    // const url = `${this.conductoresUrl}/${id}`;
    return this.http.get<Conductor>(this.url + '/getconductorbyid?IDConductor=' + id).pipe(
      tap(_ => this.log(`fetched conductor id=${id}`)),
      catchError(this.handleError<Conductor>(`getConductor id=${id}`))
    );
  }

  /* GET conductores whose name contains search term */
  searchConductores(term: string): Observable<Conductor[]> {
    if (!term.trim()) {
      // if not search term, return empty conductor array.
      return of([]);
    }
    return this.http.get<Conductor[]>(`${this.url}/?name=${term}`).pipe(
      tap(_ => this.log(`found conductores matching "${term}"`)),
      catchError(this.handleError<Conductor[]>('searchConductores', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new conductor to the server */
  addConductor(conductor: Conductor): Observable<Conductor> {
    return this.http.post<Conductor>(this.url + '/insertconductor', JSON.stringify(conductor), httpOptions).pipe(
      tap((newConductor: Conductor) => this.log(`added conductor w/ id=${newConductor.IDConductor}`)),
      catchError(this.handleError<Conductor>('addConductor'))
    );
  }



  /** PUT: update the conductor on the server */
  updateConductor(conductor: Conductor): Observable<any> {
    return this.http.put( this.url + '/updateconductor', JSON.stringify(conductor), httpOptions
    ).pipe(
      tap(_ => this.log(`updated conductor id=${conductor.IDConductor}`)),
      catchError(this.handleError<any>('updateConductor'))
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

  /** Log a ConductorService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`ConductorService: ${message}`);
  }
}
