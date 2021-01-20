import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Servicio } from '../model/servicio';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ServicioService {


  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  url = environment.base_Url1;

  /** GET servicios from the server */
  getServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.url + '/getservicio')
      .pipe(
        tap(_ => this.log('fetched servicios')),
        catchError(this.handleError('getServicios', []))
      );
  }

  getServiciosFilter(term: String): Observable<Servicio[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<Servicio[]>(this.url + 'ServiciosQ.php', { params: { 'comando': 'query1', 'where': 'and servicio_tipo like "%' + term + '%"' } })
      .pipe(
        tap(_ => this.log('fetched servicios')),
        catchError(this.handleError('getServicios', []))
      );
  }

  /** GET servicio by id. Return `undefined` when id not found */
  getServicioNo404<Data>(id: number): Observable<Servicio> {
    const url = `${ this.url }/?id=${id}`;
    return this.http.get<Servicio[]>(url)
      .pipe(
        map(servicios => servicios[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} servicio id=${id}`);
        }),
        catchError(this.handleError<Servicio>(`getServicio id=${id}`))
      );
  }

  /** GET servicio by id. Will 404 if id not found */
  getServicio(id: number): Observable<Servicio> {
    // const url = `${this.serviciosUrl}/${id}`;
    return this.http.get<Servicio>(this.url + 'ServiciosQ.php?comando=queryById&where= and id_servicio_tipo=' + id).pipe(
      tap(_ => this.log(`fetched servicio id=${id}`)),
      catchError(this.handleError<Servicio>(`getServicio id=${id}`))
    );
  }

  /* GET servicios whose name contains search term */
  searchServicios(term: string): Observable<Servicio[]> {
    if (!term.trim()) {
      // if not search term, return empty servicio array.
      return of([]);
    }
    return this.http.get<Servicio[]>(`${this.url}/?name=${term}`).pipe(
      tap(_ => this.log(`found servicios matching "${term}"`)),
      catchError(this.handleError<Servicio[]>('searchServicios', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new servicio to the server */
  addServicio(servicio: Servicio): Observable<Servicio> {
    return this.http.post<Servicio>(this.url + '/insertservicio', JSON.stringify(servicio), httpOptions).pipe(
      tap((newServicio: Servicio) => this.log(`added servicio w/ id=${newServicio.IDServicio}`)),
      catchError(this.handleError<Servicio>('addServicio'))
    );
  }



  /** PUT: update the servicio on the server */
  updateServicio(servicio: Servicio): Observable<any> {
    return this.http.put( this.url + '/updateservicio', JSON.stringify(servicio), httpOptions
    ).pipe(
      tap(_ => this.log(`updated servicio id=${servicio.IDServicio}`)),
      catchError(this.handleError<any>('updateServicio'))
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

  /** Log a ServicioService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`ServicioService: ${message}`);
  }
}
