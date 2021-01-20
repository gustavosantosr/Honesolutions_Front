import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { ServicioTipo } from '../model/servicioTipo';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ServiciotipoService {


  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  url = environment.base_Url1;

  /** GET serviciotipos from the server */
  getServicioTipos(): Observable<ServicioTipo[]> {
    return this.http.get<ServicioTipo[]>(this.url + '/getserviciotipo')
      .pipe(
        tap(_ => this.log('fetched serviciotipos')),
        catchError(this.handleError('getServicioTipos', []))
      );
  }

  getServicioTiposFilter(term: String): Observable<ServicioTipo[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<ServicioTipo[]>(this.url + 'ServicioTiposQ.php', { params: { 'comando': 'query1', 'where': 'and serviciotipo_tipo like "%' + term + '%"' } })
      .pipe(
        tap(_ => this.log('fetched serviciotipos')),
        catchError(this.handleError('getServicioTipos', []))
      );
  }

  /** GET serviciotipo by id. Return `undefined` when id not found */
  getServicioTipoNo404<Data>(id: number): Observable<ServicioTipo> {
    const url = `${ this.url }/?id=${id}`;
    return this.http.get<ServicioTipo[]>(url)
      .pipe(
        map(serviciotipos => serviciotipos[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} serviciotipo id=${id}`);
        }),
        catchError(this.handleError<ServicioTipo>(`getServicioTipo id=${id}`))
      );
  }

  /** GET serviciotipo by id. Will 404 if id not found */
  getServicioTipo(id: number): Observable<ServicioTipo> {
    // const url = `${this.serviciotiposUrl}/${id}`;
    return this.http.get<ServicioTipo>(this.url + 'ServicioTiposQ.php?comando=queryById&where= and id_serviciotipo_tipo=' + id).pipe(
      tap(_ => this.log(`fetched serviciotipo id=${id}`)),
      catchError(this.handleError<ServicioTipo>(`getServicioTipo id=${id}`))
    );
  }

  /* GET serviciotipos whose name contains search term */
  searchServicioTipos(term: string): Observable<ServicioTipo[]> {
    if (!term.trim()) {
      // if not search term, return empty serviciotipo array.
      return of([]);
    }
    return this.http.get<ServicioTipo[]>(`${this.url}/?name=${term}`).pipe(
      tap(_ => this.log(`found serviciotipos matching "${term}"`)),
      catchError(this.handleError<ServicioTipo[]>('searchServicioTipos', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new serviciotipo to the server */
  addServicioTipo(serviciotipo: ServicioTipo): Observable<ServicioTipo> {
    return this.http.post<ServicioTipo>(this.url + '/insertserviciotipo', JSON.stringify(serviciotipo)).pipe(
      tap((newServicioTipo: ServicioTipo) => this.log(`added serviciotipo w/ id=${newServicioTipo.IDServicioTipo}`)),
      catchError(this.handleError<ServicioTipo>('addServicioTipo'))
    );
  }



  /** PUT: update the serviciotipo on the server */
  updateServicioTipo(serviciotipo: ServicioTipo): Observable<any> {
    return this.http.put( this.url + '/updateserviciotipo', JSON.stringify(serviciotipo), httpOptions
    ).pipe(
      tap(_ => this.log(`updated serviciotipo id=${serviciotipo.IDServicioTipo}`)),
      catchError(this.handleError<any>('updateServicioTipo'))
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

  /** Log a ServicioTipoService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`ServicioTipoService: ${message}`);
  }
}
