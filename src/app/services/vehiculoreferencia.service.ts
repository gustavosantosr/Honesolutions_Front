import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { VehiculoReferencia } from '../model/vehiculoReferencia';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class VehiculoreferenciaService {


  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  url = environment.base_Url1;

  /** GET vehiculoreferencias from the server */
  getVehiculoReferencias(): Observable<VehiculoReferencia[]> {
    return this.http.get<VehiculoReferencia[]>(this.url + '/getvehiculoreferencia')
      .pipe(
        tap(_ => this.log('fetched vehiculoreferencias')),
        catchError(this.handleError('getVehiculoReferencias', []))
      );
  }

  getVehiculoReferenciasFilter(term: String): Observable<VehiculoReferencia[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<VehiculoReferencia[]>(this.url + 'VehiculoReferenciasQ.php', { params: { 'comando': 'query1', 'where': 'and vehiculoreferencia_referencia like "%' + term + '%"' } })
      .pipe(
        tap(_ => this.log('fetched vehiculoreferencias')),
        catchError(this.handleError('getVehiculoReferencias', []))
      );
  }

  /** GET vehiculoreferencia by id. Return `undefined` when id not found */
  getVehiculoReferenciaNo404<Data>(id: number): Observable<VehiculoReferencia> {
    const url = `${ this.url }/?id=${id}`;
    return this.http.get<VehiculoReferencia[]>(url)
      .pipe(
        map(vehiculoreferencias => vehiculoreferencias[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} vehiculoreferencia id=${id}`);
        }),
        catchError(this.handleError<VehiculoReferencia>(`getVehiculoReferencia id=${id}`))
      );
  }

  /** GET vehiculoreferencia by id. Will 404 if id not found */
  getVehiculoReferencia(id: number): Observable<VehiculoReferencia> {
    // const url = `${this.vehiculoreferenciasUrl}/${id}`;
    return this.http.get<VehiculoReferencia>(this.url + 'VehiculoReferenciasQ.php?comando=queryById&where= and id_vehiculoreferencia_referencia=' + id).pipe(
      tap(_ => this.log(`fetched vehiculoreferencia id=${id}`)),
      catchError(this.handleError<VehiculoReferencia>(`getVehiculoReferencia id=${id}`))
    );
  }

  /* GET vehiculoreferencias whose name contains search term */
  searchVehiculoReferencias(term: string): Observable<VehiculoReferencia[]> {
    if (!term.trim()) {
      // if not search term, return empty vehiculoreferencia array.
      return of([]);
    }
    return this.http.get<VehiculoReferencia[]>(`${this.url}/?name=${term}`).pipe(
      tap(_ => this.log(`found vehiculoreferencias matching "${term}"`)),
      catchError(this.handleError<VehiculoReferencia[]>('searchVehiculoReferencias', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new vehiculoreferencia to the server */
  addVehiculoReferencia(vehiculoreferencia: VehiculoReferencia): Observable<VehiculoReferencia> {
    return this.http.post<VehiculoReferencia>(this.url + '/insertvehiculoreferencia', JSON.stringify(vehiculoreferencia)).pipe(
      tap((newVehiculoReferencia: VehiculoReferencia) => this.log(`added vehiculoreferencia w/ id=${newVehiculoReferencia.IDVehiculoReferencia}`)),
      catchError(this.handleError<VehiculoReferencia>('addVehiculoReferencia'))
    );
  }



  /** PUT: update the vehiculoreferencia on the server */
  updateVehiculoReferencia(vehiculoreferencia: VehiculoReferencia): Observable<any> {
    return this.http.put( this.url + '/updatevehiculoreferencia', JSON.stringify(vehiculoreferencia), httpOptions
    ).pipe(
      tap(_ => this.log(`updated vehiculoreferencia id=${vehiculoreferencia.IDVehiculoReferencia}`)),
      catchError(this.handleError<any>('updateVehiculoReferencia'))
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

  /** Log a VehiculoReferenciaService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`VehiculoReferenciaService: ${message}`);
  }
}

