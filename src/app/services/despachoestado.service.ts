import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { DespachoEstado } from '../model/despachoEstado';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DespachoestadoService {


  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  url = environment.base_Url1;

  /** GET despachoestados from the server */
  getDespachoEstados(): Observable<DespachoEstado[]> {
    return this.http.get<DespachoEstado[]>(this.url + '/getdespachoestado')
      .pipe(
        tap(_ => this.log('fetched despachoestados')),
        catchError(this.handleError('getDespachoEstados', []))
      );
  }

  getDespachoEstadosFilter(term: String): Observable<DespachoEstado[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<DespachoEstado[]>(this.url + 'DespachoEstadosQ.php', { params: { 'comando': 'query1', 'where': 'and despachoestado_tipo like "%' + term + '%"' } })
      .pipe(
        tap(_ => this.log('fetched despachoestados')),
        catchError(this.handleError('getDespachoEstados', []))
      );
  }

  /** GET despachoestado by id. Return `undefined` when id not found */
  getDespachoEstadoNo404<Data>(id: number): Observable<DespachoEstado> {
    const url = `${ this.url }/?id=${id}`;
    return this.http.get<DespachoEstado[]>(url)
      .pipe(
        map(despachoestados => despachoestados[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} despachoestado id=${id}`);
        }),
        catchError(this.handleError<DespachoEstado>(`getDespachoEstado id=${id}`))
      );
  }

  /** GET despachoestado by id. Will 404 if id not found */
  getDespachoEstado(id: number): Observable<DespachoEstado> {
    // const url = `${this.despachoestadosUrl}/${id}`;
    return this.http.get<DespachoEstado>(this.url + 'DespachoEstadosQ.php?comando=queryById&where= and id_despachoestado_tipo=' + id).pipe(
      tap(_ => this.log(`fetched despachoestado id=${id}`)),
      catchError(this.handleError<DespachoEstado>(`getDespachoEstado id=${id}`))
    );
  }

  /* GET despachoestados whose name contains search term */
  searchDespachoEstados(term: string): Observable<DespachoEstado[]> {
    if (!term.trim()) {
      // if not search term, return empty despachoestado array.
      return of([]);
    }
    return this.http.get<DespachoEstado[]>(`${this.url}/?name=${term}`).pipe(
      tap(_ => this.log(`found despachoestados matching "${term}"`)),
      catchError(this.handleError<DespachoEstado[]>('searchDespachoEstados', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new despachoestado to the server */
  addDespachoEstado(despachoestado: DespachoEstado): Observable<DespachoEstado> {
    return this.http.post<DespachoEstado>(this.url + '/insertdespachoestado', JSON.stringify(despachoestado)).pipe(
      tap((newDespachoEstado: DespachoEstado) => this.log(`added despachoestado w/ id=${newDespachoEstado.IDDespachoEstado}`)),
      catchError(this.handleError<DespachoEstado>('addDespachoEstado'))
    );
  }



  /** PUT: update the despachoestado on the server */
  updateDespachoEstado(despachoestado: DespachoEstado): Observable<any> {
    return this.http.put( this.url + '/updatedespachoestado', JSON.stringify(despachoestado), httpOptions
    ).pipe(
      tap(_ => this.log(`updated despachoestado id=${despachoestado.IDDespachoEstado}`)),
      catchError(this.handleError<any>('updateDespachoEstado'))
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

  /** Log a DespachoEstadoService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`DespachoEstadoService: ${message}`);
  }
}

