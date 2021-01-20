import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Departamento } from '../model/departamento';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {


  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  url = environment.base_Url1;

  /** GET departamentos from the server */
  getDepartamentos(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(this.url + '/getdepartamento')
      .pipe(
        tap(_ => this.log('fetched departamentos')),
        catchError(this.handleError('getDepartamentos', []))
      );
  }
  getDepartamentosActivos(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(this.url + '/getdepartamentoactivo')
      .pipe(
        tap(_ => this.log('fetched departamentos')),
        catchError(this.handleError('getDepartamentos', []))
      );
  }
  getDepartamentosInactivos(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(this.url + '/getdepartamentoinactivo')
      .pipe(
        tap(_ => this.log('fetched departamentos')),
        catchError(this.handleError('getDepartamentos', []))
      );
  }

  getDepartamentosFilter(term: String): Observable<Departamento[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<Departamento[]>(this.url + 'DepartamentosQ.php', { params: { 'comando': 'query1', 'where': 'and departamento_tipo like "%' + term + '%"' } })
      .pipe(
        tap(_ => this.log('fetched departamentos')),
        catchError(this.handleError('getDepartamentos', []))
      );
  }

  /** GET departamento by id. Return `undefined` when id not found */
  getDepartamentoNo404<Data>(id: number): Observable<Departamento> {
    const url = `${ this.url }/?id=${id}`;
    return this.http.get<Departamento[]>(url)
      .pipe(
        map(departamentos => departamentos[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} departamento id=${id}`);
        }),
        catchError(this.handleError<Departamento>(`getDepartamento id=${id}`))
      );
  }

  /** GET departamento by id. Will 404 if id not found */
  getDepartamentosbyCliente(id: number): Observable<Departamento[]> {
    // const url = `${this.departamentosUrl}/${id}`;
    return this.http.get<Departamento[]>(this.url + '/getdepartamentosbycliente?IDCliente=' + id).pipe(
      tap(_ => this.log(`fetched departamento id=${id}`)),
      catchError(this.handleError<Departamento[]>(`getDepartamento[] id=${id}`))
    );
  }

  /* GET departamentos whose name contains search term */
  searchDepartamentos(term: string): Observable<Departamento[]> {
    if (!term.trim()) {
      // if not search term, return empty departamento array.
      return of([]);
    }
    return this.http.get<Departamento[]>(`${this.url}/?name=${term}`).pipe(
      tap(_ => this.log(`found departamentos matching "${term}"`)),
      catchError(this.handleError<Departamento[]>('searchDepartamentos', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new departamento to the server */
  addDepartamento(departamento: Departamento): Observable<Departamento> {
    return this.http.post<Departamento>(this.url + '/insertdepartamento', JSON.stringify(departamento), httpOptions).pipe(
      tap((newDepartamento: Departamento) => this.log(`added departamento w/ id=${newDepartamento.IDDepartamento}`)),
      catchError(this.handleError<Departamento>('addDepartamento'))
    );
  }



  /** PUT: update the departamento on the server */
  updateDepartamento(departamento: Departamento): Observable<any> {
    return this.http.put( this.url + '/updatedepartamento', JSON.stringify(departamento), httpOptions
    ).pipe(
      tap(_ => this.log(`updated departamento id=${departamento.IDDepartamento}`)),
      catchError(this.handleError<any>('updateDepartamento'))
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

  /** Log a DepartamentoService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`DepartamentoService: ${message}`);
  }
}
