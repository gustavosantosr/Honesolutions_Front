import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


import { MessageService } from './message.service';
import { ServicioEspecialidad } from '../model/servicioespecialidad';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ServicioespecialidadService {


  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  url = environment.base_Url1;

  /** GET servicioespecialidades from the server */
 
  getServicioEspecialidades(): Observable<ServicioEspecialidad[]> {
    return this.http.get<ServicioEspecialidad[]>(this.url + '/getservicioespecialidad')
      .pipe(
        tap(_ => this.log('fetched servicioespecialidades')),
        catchError(this.handleError('getServicioEspecialidades', []))
      );
  }

  getServicioEspecialidadesFilter(term: String): Observable<ServicioEspecialidad[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<ServicioEspecialidad[]>(this.url + 'ServicioEspecialidadesQ.php', { params: { 'comando': 'query1', 'where': 'and servicioespecialidad_tipo like "%' + term + '%"' } })
      .pipe(
        tap(_ => this.log('fetched servicioespecialidades')),
        catchError(this.handleError('getServicioEspecialidades', []))
      );
  }

  /** GET servicioespecialidad by id. Return `undefined` when id not found */
  getServicioEspecialidadNo404<Data>(id: number): Observable<ServicioEspecialidad> {
    const url = `${ this.url }/?id=${id}`;
    return this.http.get<ServicioEspecialidad[]>(url)
      .pipe(
        map(servicioespecialidades => servicioespecialidades[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} servicioespecialidad id=${id}`);
        }),
        catchError(this.handleError<ServicioEspecialidad>(`getServicioEspecialidad id=${id}`))
      );
  }

  /** GET servicioespecialidad by id. Will 404 if id not found */
  getServicioEspecialidad(id: number): Observable<ServicioEspecialidad> {
    // const url = `${this.servicioespecialidadesUrl}/${id}`;
    return this.http.get<ServicioEspecialidad>(this.url + 'ServicioEspecialidadesQ.php?comando=queryById&where= and id_servicioespecialidad_tipo=' + id).pipe(
      tap(_ => this.log(`fetched servicioespecialidad id=${id}`)),
      catchError(this.handleError<ServicioEspecialidad>(`getServicioEspecialidad id=${id}`))
    );
  }

  /* GET servicioespecialidades whose name contains search term */
  searchServicioEspecialidades(term: string): Observable<ServicioEspecialidad[]> {
    if (!term.trim()) {
      // if not search term, return empty servicioespecialidad array.
      return of([]);
    }
    return this.http.get<ServicioEspecialidad[]>(`${this.url}/?name=${term}`).pipe(
      tap(_ => this.log(`found servicioespecialidades matching "${term}"`)),
      catchError(this.handleError<ServicioEspecialidad[]>('searchServicioEspecialidades', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new servicioespecialidad to the server */
  addServicioEspecialidad(servicioespecialidad: ServicioEspecialidad): Observable<ServicioEspecialidad> {
    return this.http.post<ServicioEspecialidad>(this.url + '/insertservicioespecialidad', JSON.stringify(servicioespecialidad)).pipe(
      tap((newServicioEspecialidad: ServicioEspecialidad) => this.log(`added servicioespecialidad w/ id=${newServicioEspecialidad.IDServicioEspecialidad}`)),
      catchError(this.handleError<ServicioEspecialidad>('addServicioEspecialidad'))
    );
  }



  /** PUT: update the servicioespecialidad on the server */
  updateServicioEspecialidad(servicioespecialidad: ServicioEspecialidad): Observable<any> {
    return this.http.put( this.url + '/updateservicioespecialidad', JSON.stringify(servicioespecialidad), httpOptions
    ).pipe(
      tap(_ => this.log(`updated servicioespecialidad id=${servicioespecialidad.IDServicioEspecialidad}`)),
      catchError(this.handleError<any>('updateServicioEspecialidad'))
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

  /** Log a ServicioEspecialidadService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`ServicioEspecialidadService: ${message}`);
  }
}
