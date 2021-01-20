import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { ActividadTipo } from '../model/actividadTipo';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ActividadtipoService {


  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  url = environment.base_Url1;

  /** GET actividadtipos from the server */
  getActividadTipos(): Observable<ActividadTipo[]> {
    return this.http.get<ActividadTipo[]>(this.url + '/getactividadtipo')
      .pipe(
        tap(_ => this.log('fetched actividadtipos')),
        catchError(this.handleError('getActividadTipos', []))
      );
  }

  getActividadTiposFilter(term: String): Observable<ActividadTipo[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<ActividadTipo[]>(this.url + 'ActividadTiposQ.php', { params: { 'comando': 'query1', 'where': 'and actividadtipo_tipo like "%' + term + '%"' } })
      .pipe(
        tap(_ => this.log('fetched actividadtipos')),
        catchError(this.handleError('getActividadTipos', []))
      );
  }

  /** GET actividadtipo by id. Return `undefined` when id not found */
  getActividadTipoNo404<Data>(id: number): Observable<ActividadTipo> {
    const url = `${ this.url }/?id=${id}`;
    return this.http.get<ActividadTipo[]>(url)
      .pipe(
        map(actividadtipos => actividadtipos[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} actividadtipo id=${id}`);
        }),
        catchError(this.handleError<ActividadTipo>(`getActividadTipo id=${id}`))
      );
  }

  /** GET actividadtipo by id. Will 404 if id not found */
  getActividadTipo(id: number): Observable<ActividadTipo> {
    // const url = `${this.actividadtiposUrl}/${id}`;
    return this.http.get<ActividadTipo>(this.url + 'ActividadTiposQ.php?comando=queryById&where= and id_actividadtipo_tipo=' + id).pipe(
      tap(_ => this.log(`fetched actividadtipo id=${id}`)),
      catchError(this.handleError<ActividadTipo>(`getActividadTipo id=${id}`))
    );
  }

  /* GET actividadtipos whose name contains search term */
  searchActividadTipos(term: string): Observable<ActividadTipo[]> {
    if (!term.trim()) {
      // if not search term, return empty actividadtipo array.
      return of([]);
    }
    return this.http.get<ActividadTipo[]>(`${this.url}/?name=${term}`).pipe(
      tap(_ => this.log(`found actividadtipos matching "${term}"`)),
      catchError(this.handleError<ActividadTipo[]>('searchActividadTipos', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new actividadtipo to the server */
  addActividadTipo(actividadtipo: ActividadTipo): Observable<ActividadTipo> {
    return this.http.post<ActividadTipo>(this.url + '/insertactividadtipo', JSON.stringify(actividadtipo)).pipe(
      tap((newActividadTipo: ActividadTipo) => this.log(`added actividadtipo w/ id=${newActividadTipo.IDActividadTipo}`)),
      catchError(this.handleError<ActividadTipo>('addActividadTipo'))
    );
  }



  /** PUT: update the actividadtipo on the server */
  updateActividadTipo(actividadtipo: ActividadTipo): Observable<any> {
    return this.http.put( this.url + '/updateactividadtipo', JSON.stringify(actividadtipo), httpOptions
    ).pipe(
      tap(_ => this.log(`updated actividadtipo id=${actividadtipo.IDActividadTipo}`)),
      catchError(this.handleError<any>('updateActividadTipo'))
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

  /** Log a ActividadTipoService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`ActividadTipoService: ${message}`);
  }
}

