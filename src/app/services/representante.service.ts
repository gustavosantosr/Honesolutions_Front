import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Representante } from '../model/representante';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class RepresentanteService {


  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  url = environment.base_Url1;

  /** GET representantes from the server */
  getRepresentantes(): Observable<Representante[]> {
    return this.http.get<Representante[]>(this.url + '/getrepresentante')
      .pipe(
        tap(_ => this.log('fetched representantes')),
        catchError(this.handleError('getRepresentantes', []))
      );
  }

  getRepresentantesFilter(term: String): Observable<Representante[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<Representante[]>(this.url + 'RepresentantesQ.php', { params: { 'comando': 'query1', 'where': 'and representante_tipo like "%' + term + '%"' } })
      .pipe(
        tap(_ => this.log('fetched representantes')),
        catchError(this.handleError('getRepresentantes', []))
      );
  }

  /** GET representante by id. Return `undefined` when id not found */
  getRepresentanteNo404<Data>(id: number): Observable<Representante> {
    const url = `${ this.url }/?id=${id}`;
    return this.http.get<Representante[]>(url)
      .pipe(
        map(representantes => representantes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} representante id=${id}`);
        }),
        catchError(this.handleError<Representante>(`getRepresentante id=${id}`))
      );
  }

  /** GET representante by id. Will 404 if id not found */
  getRepresentante(id: number): Observable<Representante> {
    // const url = `${this.representantesUrl}/${id}`;
    return this.http.get<Representante>(this.url + '/getrepresentantebyidcliente?IDCliente=' + id).pipe(
      tap(_ => this.log(`fetched representante id=${id}`)),
      catchError(this.handleError<Representante>(`getRepresentante id=${id}`))
    );
  }
  /** GET representante by id. Will 404 if id not found */
  getRepresentantebyId(id: number): Observable<Representante[]> {
    // const url = `${this.representantesUrl}/${id}`;
    return this.http.get<Representante[]>(this.url + '/getrepresentantebyidcliente?IDCliente=' + id).pipe(
      tap(_ => this.log(`fetched representante id=${id}`)),
      catchError(this.handleError<Representante[]>(`getRepresentante id=${id}`))
    );
  }

  /* GET representantes whose name contains search term */
  searchRepresentantes(term: string): Observable<Representante[]> {
    if (!term.trim()) {
      // if not search term, return empty representante array.
      return of([]);
    }
    return this.http.get<Representante[]>(`${this.url}/?name=${term}`).pipe(
      tap(_ => this.log(`found representantes matching "${term}"`)),
      catchError(this.handleError<Representante[]>('searchRepresentantes', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new representante to the server */
  addRepresentante(representante: Representante): Observable<Representante> {
    return this.http.post<Representante>(this.url + '/insertrepresentante', JSON.stringify(representante), httpOptions).pipe(
      tap((newRepresentante: Representante) => this.log(`added representante w/ id=${newRepresentante.IDRepresentante}`)),
      catchError(this.handleError<Representante>('addRepresentante'))
    );
  }



  /** PUT: update the representante on the server */
  updateRepresentante(representante: Representante): Observable<any> {
    return this.http.put( this.url + '/updaterepresentante', JSON.stringify(representante), httpOptions
    ).pipe(
      tap(_ => this.log(`updated representante id=${representante.IDRepresentante}`)),
      catchError(this.handleError<any>('updateRepresentante'))
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

  /** Log a RepresentanteService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`RepresentanteService: ${message}`);
  }
}
