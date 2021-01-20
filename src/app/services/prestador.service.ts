import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Prestador } from '../model/prestador';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PrestadorService {


  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  url = environment.base_Url1;

  /** GET prestadores from the server */
  getPrestadores(): Observable<Prestador[]> {
    return this.http.get<Prestador[]>(this.url + '/getprestador')
      .pipe(
        tap(_ => this.log('fetched prestadores')),
        catchError(this.handleError('getPrestadores', []))
      );
  }

  getPrestadoresFilter(term: String): Observable<Prestador[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<Prestador[]>(this.url + 'PrestadoresQ.php', { params: { 'comando': 'query1', 'where': 'and prestador_tipo like "%' + term + '%"' } })
      .pipe(
        tap(_ => this.log('fetched prestadores')),
        catchError(this.handleError('getPrestadores', []))
      );
  }

  /** GET prestador by id. Return `undefined` when id not found */
  getPrestadorNo404<Data>(id: number): Observable<Prestador> {
    const url = `${ this.url }/?id=${id}`;
    return this.http.get<Prestador[]>(url)
      .pipe(
        map(prestadores => prestadores[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} prestador id=${id}`);
        }),
        catchError(this.handleError<Prestador>(`getPrestador id=${id}`))
      );
  }

  /** GET prestador by id. Will 404 if id not found */
  getPrestador(id: number): Observable<Prestador> {
    // const url = `${this.prestadoresUrl}/${id}`;
    return this.http.get<Prestador>(this.url + 'PrestadoresQ.php?comando=queryById&where= and id_prestador_tipo=' + id).pipe(
      tap(_ => this.log(`fetched prestador id=${id}`)),
      catchError(this.handleError<Prestador>(`getPrestador id=${id}`))
    );
  }

  /* GET prestadores whose name contains search term */
  searchPrestadores(term: string): Observable<Prestador[]> {
    if (!term.trim()) {
      // if not search term, return empty prestador array.
      return of([]);
    }
    return this.http.get<Prestador[]>(`${this.url}/?name=${term}`).pipe(
      tap(_ => this.log(`found prestadores matching "${term}"`)),
      catchError(this.handleError<Prestador[]>('searchPrestadores', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new prestador to the server */
  addPrestador(prestador: Prestador): Observable<Prestador> {
    return this.http.post<Prestador>(this.url + '/insertprestador', JSON.stringify(prestador), httpOptions).pipe(
      tap((newPrestador: Prestador) => this.log(`added prestador w/ id=${newPrestador.IDPrestador}`)),
      catchError(this.handleError<Prestador>('addPrestador'))
    );
  }



  /** PUT: update the prestador on the server */
  updatePrestador(prestador: Prestador): Observable<any> {
    return this.http.put( this.url + '/updateprestador', JSON.stringify(prestador), httpOptions
    ).pipe(
      tap(_ => this.log(`updated prestador id=${prestador.IDPrestador}`)),
      catchError(this.handleError<any>('updatePrestador'))
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

  /** Log a PrestadorService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`PrestadorService: ${message}`);
  }
}

