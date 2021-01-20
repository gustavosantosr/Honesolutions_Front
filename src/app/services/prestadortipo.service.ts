import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { PrestadorTipo } from '../model/prestadorTipo';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PrestadortipoService {


  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  url = environment.base_Url1;

  /** GET prestadortipos from the server */
  getPrestadorTipos(): Observable<PrestadorTipo[]> {
    return this.http.get<PrestadorTipo[]>(this.url + '/getprestadortipo')
      .pipe(
        tap(_ => this.log('fetched prestadortipos')),
        catchError(this.handleError('getPrestadorTipos', []))
      );
  }

  getPrestadorTiposFilter(term: String): Observable<PrestadorTipo[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<PrestadorTipo[]>(this.url + 'PrestadorTiposQ.php', { params: { 'comando': 'query1', 'where': 'and prestadortipo_tipo like "%' + term + '%"' } })
      .pipe(
        tap(_ => this.log('fetched prestadortipos')),
        catchError(this.handleError('getPrestadorTipos', []))
      );
  }

  /** GET prestadortipo by id. Return `undefined` when id not found */
  getPrestadorTipoNo404<Data>(id: number): Observable<PrestadorTipo> {
    const url = `${ this.url }/?id=${id}`;
    return this.http.get<PrestadorTipo[]>(url)
      .pipe(
        map(prestadortipos => prestadortipos[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} prestadortipo id=${id}`);
        }),
        catchError(this.handleError<PrestadorTipo>(`getPrestadorTipo id=${id}`))
      );
  }

  /** GET prestadortipo by id. Will 404 if id not found */
  getPrestadorTipo(id: number): Observable<PrestadorTipo> {
    // const url = `${this.prestadortiposUrl}/${id}`;
    return this.http.get<PrestadorTipo>(this.url + 'PrestadorTiposQ.php?comando=queryById&where= and id_prestadortipo_tipo=' + id).pipe(
      tap(_ => this.log(`fetched prestadortipo id=${id}`)),
      catchError(this.handleError<PrestadorTipo>(`getPrestadorTipo id=${id}`))
    );
  }

  /* GET prestadortipos whose name contains search term */
  searchPrestadorTipos(term: string): Observable<PrestadorTipo[]> {
    if (!term.trim()) {
      // if not search term, return empty prestadortipo array.
      return of([]);
    }
    return this.http.get<PrestadorTipo[]>(`${this.url}/?name=${term}`).pipe(
      tap(_ => this.log(`found prestadortipos matching "${term}"`)),
      catchError(this.handleError<PrestadorTipo[]>('searchPrestadorTipos', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new prestadortipo to the server */
  addPrestadorTipo(prestadortipo: PrestadorTipo): Observable<PrestadorTipo> {
    return this.http.post<PrestadorTipo>(this.url + '/insertprestadortipo', JSON.stringify(prestadortipo)).pipe(
      tap((newPrestadorTipo: PrestadorTipo) => this.log(`added prestadortipo w/ id=${newPrestadorTipo.IDPrestadorTipo}`)),
      catchError(this.handleError<PrestadorTipo>('addPrestadorTipo'))
    );
  }



  /** PUT: update the prestadortipo on the server */
  updatePrestadorTipo(prestadortipo: PrestadorTipo): Observable<any> {
    return this.http.put( this.url + '/updateprestadortipo', JSON.stringify(prestadortipo), httpOptions
    ).pipe(
      tap(_ => this.log(`updated prestadortipo id=${prestadortipo.IDPrestadorTipo}`)),
      catchError(this.handleError<any>('updatePrestadorTipo'))
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

  /** Log a PrestadorTipoService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`PrestadorTipoService: ${message}`);
  }
}
