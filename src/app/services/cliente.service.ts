import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Cliente } from '../model/cliente';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ClienteService {


  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  url = environment.base_Url1;

  /** GET clientes from the server */
  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.url + '/getcliente')
      .pipe(
        tap(_ => this.log('fetched clientes')),
        catchError(this.handleError('getClientes', []))
      );
  }
  /** GET clientes from the server */
  getClientesActivo(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.url + '/getclienteactivo')
      .pipe(
        tap(_ => this.log('fetched clientes')),
        catchError(this.handleError('getClientes', []))
      );
  }
  /** GET clientes from the server */
  getClientesInactivo(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.url + '/getclienteinactivo')
      .pipe(
        tap(_ => this.log('fetched clientes')),
        catchError(this.handleError('getClientes', []))
      );
  }

  getClientesFilter(term: String): Observable<Cliente[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<Cliente[]>(this.url + 'ClientesQ.php', { params: { 'comando': 'query1', 'where': 'and cliente_tipo like "%' + term + '%"' } })
      .pipe(
        tap(_ => this.log('fetched clientes')),
        catchError(this.handleError('getClientes', []))
      );
  }

  /** GET cliente by id. Return `undefined` when id not found */
  getClienteNo404<Data>(id: number): Observable<Cliente> {
    const url = `${ this.url }/?id=${id}`;
    return this.http.get<Cliente[]>(url)
      .pipe(
        map(clientes => clientes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} cliente id=${id}`);
        }),
        catchError(this.handleError<Cliente>(`getCliente id=${id}`))
      );
  }

  /** GET cliente by id. Will 404 if id not found */
  getCliente(id: number): Observable<Cliente> {
    // const url = `${this.clientesUrl}/${id}`;
    return this.http.get<Cliente>(this.url + 'ClientesQ.php?comando=queryById&where= and id_cliente_tipo=' + id).pipe(
      tap(_ => this.log(`fetched cliente id=${id}`)),
      catchError(this.handleError<Cliente>(`getCliente id=${id}`))
    );
  }

  /* GET clientes whose name contains search term */
  searchClientes(term: string): Observable<Cliente[]> {
    if (!term.trim()) {
      // if not search term, return empty cliente array.
      return of([]);
    }
    return this.http.get<Cliente[]>(`${this.url}/?name=${term}`).pipe(
      tap(_ => this.log(`found clientes matching "${term}"`)),
      catchError(this.handleError<Cliente[]>('searchClientes', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new cliente to the server */
  addCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.url + '/insertcliente', JSON.stringify(cliente), httpOptions).pipe(
      tap((newCliente: Cliente) => this.log(`added cliente w/ id=${newCliente.IDCliente}`)),
      catchError(this.handleError<Cliente>('addCliente'))
    );
  }



  /** PUT: update the cliente on the server */
  updateCliente(cliente: Cliente): Observable<any> {
    return this.http.put( this.url + '/updatecliente', JSON.stringify(cliente), httpOptions
    ).pipe(
      tap(_ => this.log(`updated cliente id=${cliente.IDCliente}`)),
      catchError(this.handleError<any>('updateCliente'))
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

  /** Log a ClienteService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`ClienteService: ${message}`);
  }
}
