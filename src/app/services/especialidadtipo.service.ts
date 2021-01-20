import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { EspecialidadTipo } from '../model/especialidadTipo';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class EspecialidadtipoService {


  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  url = environment.base_Url1;

  /** GET especialidadtipos from the server */
  getEspecialidadTipos(): Observable<EspecialidadTipo[]> {
    return this.http.get<EspecialidadTipo[]>(this.url + '/getespecialidadtipo')
      .pipe(
        tap(_ => this.log('fetched especialidadtipos')),
        catchError(this.handleError('getEspecialidadTipos', []))
      );
  }

  getEspecialidadTiposFilter(term: String): Observable<EspecialidadTipo[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<EspecialidadTipo[]>(this.url + 'EspecialidadTiposQ.php', { params: { 'comando': 'query1', 'where': 'and especialidadtipo_tipo like "%' + term + '%"' } })
      .pipe(
        tap(_ => this.log('fetched especialidadtipos')),
        catchError(this.handleError('getEspecialidadTipos', []))
      );
  }

  /** GET especialidadtipo by id. Return `undefined` when id not found */
  getEspecialidadTipoNo404<Data>(id: number): Observable<EspecialidadTipo> {
    const url = `${ this.url }/?id=${id}`;
    return this.http.get<EspecialidadTipo[]>(url)
      .pipe(
        map(especialidadtipos => especialidadtipos[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} especialidadtipo id=${id}`);
        }),
        catchError(this.handleError<EspecialidadTipo>(`getEspecialidadTipo id=${id}`))
      );
  }

  /** GET especialidadtipo by id. Will 404 if id not found */
  getEspecialidadTipo(id: number): Observable<EspecialidadTipo> {
    // const url = `${this.especialidadtiposUrl}/${id}`;
    return this.http.get<EspecialidadTipo>(this.url + 'EspecialidadTiposQ.php?comando=queryById&where= and id_especialidadtipo_tipo=' + id).pipe(
      tap(_ => this.log(`fetched especialidadtipo id=${id}`)),
      catchError(this.handleError<EspecialidadTipo>(`getEspecialidadTipo id=${id}`))
    );
  }

  /* GET especialidadtipos whose name contains search term */
  searchEspecialidadTipos(term: string): Observable<EspecialidadTipo[]> {
    if (!term.trim()) {
      // if not search term, return empty especialidadtipo array.
      return of([]);
    }
    return this.http.get<EspecialidadTipo[]>(`${this.url}/?name=${term}`).pipe(
      tap(_ => this.log(`found especialidadtipos matching "${term}"`)),
      catchError(this.handleError<EspecialidadTipo[]>('searchEspecialidadTipos', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new especialidadtipo to the server */
  addEspecialidadTipo(especialidadtipo: EspecialidadTipo): Observable<EspecialidadTipo> {
    return this.http.post<EspecialidadTipo>(this.url + '/insertespecialidadtipo', JSON.stringify(especialidadtipo)).pipe(
      tap((newEspecialidadTipo: EspecialidadTipo) => this.log(`added especialidadtipo w/ id=${newEspecialidadTipo.IDEspecialidadTipo}`)),
      catchError(this.handleError<EspecialidadTipo>('addEspecialidadTipo'))
    );
  }



  /** PUT: update the especialidadtipo on the server */
  updateEspecialidadTipo(especialidadtipo: EspecialidadTipo): Observable<any> {
    return this.http.put( this.url + '/updateespecialidadtipo', JSON.stringify(especialidadtipo), httpOptions
    ).pipe(
      tap(_ => this.log(`updated especialidadtipo id=${especialidadtipo.IDEspecialidadTipo}`)),
      catchError(this.handleError<any>('updateEspecialidadTipo'))
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

  /** Log a EspecialidadTipoService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`EspecialidadTipoService: ${message}`);
  }
}
