import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { VehiculoTipo } from '../model/vehiculoTipo';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class VehiculotipoService {


  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  url = environment.base_Url1;

  /** GET vehiculotipos from the server */
  getVehiculoTipos(): Observable<VehiculoTipo[]> {
    return this.http.get<VehiculoTipo[]>(this.url + '/getvehiculotipo')
      .pipe(
        tap(_ => this.log('fetched vehiculotipos')),
        catchError(this.handleError('getVehiculoTipos', []))
      );
  }

  getVehiculoTiposFilter(term: String): Observable<VehiculoTipo[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<VehiculoTipo[]>(this.url + 'VehiculoTiposQ.php', { params: { 'comando': 'query1', 'where': 'and vehiculotipo_tipo like "%' + term + '%"' } })
      .pipe(
        tap(_ => this.log('fetched vehiculotipos')),
        catchError(this.handleError('getVehiculoTipos', []))
      );
  }

  /** GET vehiculotipo by id. Return `undefined` when id not found */
  getVehiculoTipoNo404<Data>(id: number): Observable<VehiculoTipo> {
    const url = `${ this.url }/?id=${id}`;
    return this.http.get<VehiculoTipo[]>(url)
      .pipe(
        map(vehiculotipos => vehiculotipos[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} vehiculotipo id=${id}`);
        }),
        catchError(this.handleError<VehiculoTipo>(`getVehiculoTipo id=${id}`))
      );
  }

  /** GET vehiculotipo by id. Will 404 if id not found */
  getVehiculoTipo(id: number): Observable<VehiculoTipo> {
    // const url = `${this.vehiculotiposUrl}/${id}`;
    return this.http.get<VehiculoTipo>(this.url + 'VehiculoTiposQ.php?comando=queryById&where= and id_vehiculotipo_tipo=' + id).pipe(
      tap(_ => this.log(`fetched vehiculotipo id=${id}`)),
      catchError(this.handleError<VehiculoTipo>(`getVehiculoTipo id=${id}`))
    );
  }

  /* GET vehiculotipos whose name contains search term */
  searchVehiculoTipos(term: string): Observable<VehiculoTipo[]> {
    if (!term.trim()) {
      // if not search term, return empty vehiculotipo array.
      return of([]);
    }
    return this.http.get<VehiculoTipo[]>(`${this.url}/?name=${term}`).pipe(
      tap(_ => this.log(`found vehiculotipos matching "${term}"`)),
      catchError(this.handleError<VehiculoTipo[]>('searchVehiculoTipos', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new vehiculotipo to the server */
  addVehiculoTipo(vehiculotipo: VehiculoTipo): Observable<VehiculoTipo> {
    return this.http.post<VehiculoTipo>(this.url + '/insertvehiculotipo', JSON.stringify(vehiculotipo)).pipe(
      tap((newVehiculoTipo: VehiculoTipo) => this.log(`added vehiculotipo w/ id=${newVehiculoTipo.IDVehiculoTipo}`)),
      catchError(this.handleError<VehiculoTipo>('addVehiculoTipo'))
    );
  }



  /** PUT: update the vehiculotipo on the server */
  updateVehiculoTipo(vehiculotipo: VehiculoTipo): Observable<any> {
    return this.http.put( this.url + '/updatevehiculotipo', JSON.stringify(vehiculotipo), httpOptions
    ).pipe(
      tap(_ => this.log(`updated vehiculotipo id=${vehiculotipo.IDVehiculoTipo}`)),
      catchError(this.handleError<any>('updateVehiculoTipo'))
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

  /** Log a VehiculoTipoService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`VehiculoTipoService: ${message}`);
  }
}
