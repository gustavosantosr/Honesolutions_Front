import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { CuentaTipo } from '../model/cuentaTipo';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CuentatipoService {


  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  url = environment.base_Url1;

  /** GET cuentatipos from the server */
  getCuentaTipos(): Observable<CuentaTipo[]> {
    return this.http.get<CuentaTipo[]>(this.url + '/getcuentatipo')
      .pipe(
        tap(_ => this.log('fetched cuentatipos')),
        catchError(this.handleError('getCuentaTipos', []))
      );
  }

  getCuentaTiposFilter(term: String): Observable<CuentaTipo[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<CuentaTipo[]>(this.url + 'CuentaTiposQ.php', { params: { 'comando': 'query1', 'where': 'and cuentatipo_tipo like "%' + term + '%"' } })
      .pipe(
        tap(_ => this.log('fetched cuentatipos')),
        catchError(this.handleError('getCuentaTipos', []))
      );
  }

  /** GET cuentatipo by id. Return `undefined` when id not found */
  getCuentaTipoNo404<Data>(id: number): Observable<CuentaTipo> {
    const url = `${ this.url }/?id=${id}`;
    return this.http.get<CuentaTipo[]>(url)
      .pipe(
        map(cuentatipos => cuentatipos[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} cuentatipo id=${id}`);
        }),
        catchError(this.handleError<CuentaTipo>(`getCuentaTipo id=${id}`))
      );
  }

  /** GET cuentatipo by id. Will 404 if id not found */
  getCuentaTipo(id: number): Observable<CuentaTipo> {
    // const url = `${this.cuentatiposUrl}/${id}`;
    return this.http.get<CuentaTipo>(this.url + 'CuentaTiposQ.php?comando=queryById&where= and id_cuentatipo_tipo=' + id).pipe(
      tap(_ => this.log(`fetched cuentatipo id=${id}`)),
      catchError(this.handleError<CuentaTipo>(`getCuentaTipo id=${id}`))
    );
  }

  /* GET cuentatipos whose name contains search term */
  searchCuentaTipos(term: string): Observable<CuentaTipo[]> {
    if (!term.trim()) {
      // if not search term, return empty cuentatipo array.
      return of([]);
    }
    return this.http.get<CuentaTipo[]>(`${this.url}/?name=${term}`).pipe(
      tap(_ => this.log(`found cuentatipos matching "${term}"`)),
      catchError(this.handleError<CuentaTipo[]>('searchCuentaTipos', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new cuentatipo to the server */
  addCuentaTipo(cuentatipo: CuentaTipo): Observable<CuentaTipo> {
    return this.http.post<CuentaTipo>(this.url + '/insertcuentatipo', JSON.stringify(cuentatipo)).pipe(
      tap((newCuentaTipo: CuentaTipo) => this.log(`added cuentatipo w/ id=${newCuentaTipo.IDCuentaTipo}`)),
      catchError(this.handleError<CuentaTipo>('addCuentaTipo'))
    );
  }



  /** PUT: update the cuentatipo on the server */
  updateCuentaTipo(cuentatipo: CuentaTipo): Observable<any> {
    return this.http.put( this.url + '/updatecuentatipo', JSON.stringify(cuentatipo), httpOptions
    ).pipe(
      tap(_ => this.log(`updated cuentatipo id=${cuentatipo.IDCuentaTipo}`)),
      catchError(this.handleError<any>('updateCuentaTipo'))
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

  /** Log a CuentaTipoService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`CuentaTipoService: ${message}`);
  }
}


