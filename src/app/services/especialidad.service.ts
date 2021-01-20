import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Especialidad } from '../model/especialidad';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {


  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  url = environment.base_Url1;

  /** GET especialidades from the server */
  getEspecialidades(): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(this.url + '/getespecialidad')
      .pipe(
        tap(_ => this.log('fetched especialidades')),
        catchError(this.handleError('getEspecialidades', []))
      );
  }
    /** GET especialidades from the server */
    getEspecialidadesActivo(): Observable<Especialidad[]> {
      return this.http.get<Especialidad[]>(this.url + '/getespecialidadactivo')
        .pipe(
          tap(_ => this.log('fetched especialidades')),
          catchError(this.handleError('getEspecialidades', []))
        );
    }
  /** GET especialidades from the server */
  getEspecialidadesInactivo(): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(this.url + '/getespecialidadinactivo')
      .pipe(
        tap(_ => this.log('fetched especialidades')),
        catchError(this.handleError('getEspecialidades', []))
      );
  }
  getEspecialidadesFilter(term: String): Observable<Especialidad[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<Especialidad[]>(this.url + 'EspecialidadesQ.php', { params: { 'comando': 'query1', 'where': 'and especialidad_tipo like "%' + term + '%"' } })
      .pipe(
        tap(_ => this.log('fetched especialidades')),
        catchError(this.handleError('getEspecialidades', []))
      );
  }

  /** GET especialidad by id. Return `undefined` when id not found */
  getEspecialidadNo404<Data>(id: number): Observable<Especialidad> {
    const url = `${ this.url }/?id=${id}`;
    return this.http.get<Especialidad[]>(url)
      .pipe(
        map(especialidades => especialidades[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} especialidad id=${id}`);
        }),
        catchError(this.handleError<Especialidad>(`getEspecialidad id=${id}`))
      );
  }

  /** GET especialidad by id. Will 404 if id not found */
  getEspecialidad(id: number): Observable<Especialidad> {
    // const url = `${this.especialidadesUrl}/${id}`;
    return this.http.get<Especialidad>(this.url + 'EspecialidadesQ.php?comando=queryById&where= and id_especialidad_tipo=' + id).pipe(
      tap(_ => this.log(`fetched especialidad id=${id}`)),
      catchError(this.handleError<Especialidad>(`getEspecialidad id=${id}`))
    );
  }

  /* GET especialidades whose name contains search term */
  searchEspecialidades(term: string): Observable<Especialidad[]> {
    if (!term.trim()) {
      // if not search term, return empty especialidad array.
      return of([]);
    }
    return this.http.get<Especialidad[]>(`${this.url}/?name=${term}`).pipe(
      tap(_ => this.log(`found especialidades matching "${term}"`)),
      catchError(this.handleError<Especialidad[]>('searchEspecialidades', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new especialidad to the server */
  addEspecialidad(especialidad: Especialidad): Observable<Especialidad> {
    return this.http.post<Especialidad>(this.url + '/insertespecialidad', JSON.stringify(especialidad), httpOptions).pipe(
      tap((newEspecialidad: Especialidad) => this.log(`added especialidad w/ id=${newEspecialidad.IDEspecialidad}`)),
      catchError(this.handleError<Especialidad>('addEspecialidad'))
    );
  }



  /** PUT: update the especialidad on the server */
  updateEspecialidad(especialidad: Especialidad): Observable<any> {
    return this.http.put( this.url + '/updateespecialidad', JSON.stringify(especialidad), httpOptions
    ).pipe(
      tap(_ => this.log(`updated especialidad id=${especialidad.IDEspecialidad}`)),
      catchError(this.handleError<any>('updateEspecialidad'))
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

  /** Log a EspecialidadService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`EspecialidadService: ${message}`);
  }
}

