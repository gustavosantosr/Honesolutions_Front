import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Propietario } from '../model/propietario';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PropietarioService {


  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  url = environment.base_Url1;

  /** GET propietarioes from the server */
  getPropietarios(): Observable<Propietario[]> {
    return this.http.get<Propietario[]>(this.url + '/getpropietario')
      .pipe(
        tap(_ => this.log('fetched propietarioes')),
        catchError(this.handleError('getPropietarios', []))
      );
  }

  getPropietariosFilter(term: String): Observable<Propietario[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<Propietario[]>(this.url + 'PropietariosQ.php', { params: { 'comando': 'query1', 'where': 'and propietario_tipo like "%' + term + '%"' } })
      .pipe(
        tap(_ => this.log('fetched propietarioes')),
        catchError(this.handleError('getPropietarios', []))
      );
  }

  /** GET propietario by id. Return `undefined` when id not found */
  getPropietarioNo404<Data>(id: number): Observable<Propietario> {
    const url = `${ this.url }/?id=${id}`;
    return this.http.get<Propietario[]>(url)
      .pipe(
        map(propietarioes => propietarioes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} propietario id=${id}`);
        }),
        catchError(this.handleError<Propietario>(`getPropietario id=${id}`))
      );
  }

  /** GET propietario by id. Will 404 if id not found */
  getPropietario(id: number): Observable<Propietario> {
    // const url = `${this.propietarioesUrl}/${id}`;
    return this.http.get<Propietario>(this.url + 'PropietariosQ.php?comando=queryById&where= and id_propietario_tipo=' + id).pipe(
      tap(_ => this.log(`fetched propietario id=${id}`)),
      catchError(this.handleError<Propietario>(`getPropietario id=${id}`))
    );
  }

  /* GET propietarioes whose name contains search term */
  searchPropietarios(term: string): Observable<Propietario[]> {
    if (!term.trim()) {
      // if not search term, return empty propietario array.
      return of([]);
    }
    return this.http.get<Propietario[]>(`${this.url}/?name=${term}`).pipe(
      tap(_ => this.log(`found propietarioes matching "${term}"`)),
      catchError(this.handleError<Propietario[]>('searchPropietarios', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new propietario to the server */
  addPropietario(propietario: Propietario): Observable<Propietario> {
    return this.http.post<Propietario>(this.url + '/insertpropietario', JSON.stringify(propietario)).pipe(
      tap((newPropietario: Propietario) => this.log(`added propietario w/ id=${newPropietario.IDPropietario}`)),
      catchError(this.handleError<Propietario>('addPropietario'))
    );
  }



  /** PUT: update the propietario on the server */
  updatePropietario(propietario: Propietario): Observable<any> {
    return this.http.put( this.url + '/updatepropietario', JSON.stringify(propietario), httpOptions
    ).pipe(
      tap(_ => this.log(`updated propietario id=${propietario.IDPropietario}`)),
      catchError(this.handleError<any>('updatePropietario'))
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

  /** Log a PropietarioService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`PropietarioService: ${message}`);
  }
}
