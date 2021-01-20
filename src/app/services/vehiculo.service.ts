import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Vehiculo } from '../model/vehiculo';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {


  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  url = environment.base_Url1;

  /** GET vehiculos from the server */
  getVehiculos(): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(this.url + '/getvehiculo')
      .pipe(
        tap(_ => this.log('fetched vehiculos')),
        catchError(this.handleError('getVehiculos', []))
      );
  }

  getVehiculosFilter(term: String): Observable<Vehiculo[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<Vehiculo[]>(this.url + 'VehiculosQ.php', { params: { 'comando': 'query1', 'where': 'and vehiculo_tipo like "%' + term + '%"' } })
      .pipe(
        tap(_ => this.log('fetched vehiculos')),
        catchError(this.handleError('getVehiculos', []))
      );
  }

  /** GET vehiculo by id. Return `undefined` when id not found */
  getVehiculoNo404<Data>(id: number): Observable<Vehiculo> {
    const url = `${ this.url }/?id=${id}`;
    return this.http.get<Vehiculo[]>(url)
      .pipe(
        map(vehiculos => vehiculos[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} vehiculo id=${id}`);
        }),
        catchError(this.handleError<Vehiculo>(`getVehiculo id=${id}`))
      );
  }

  /** GET vehiculo by id. Will 404 if id not found */
  getVehiculo(id: number): Observable<Vehiculo> {
    // const url = `${this.vehiculosUrl}/${id}`;
    return this.http.get<Vehiculo>(this.url + 'VehiculosQ.php?comando=queryById&where= and id_vehiculo_tipo=' + id).pipe(
      tap(_ => this.log(`fetched vehiculo id=${id}`)),
      catchError(this.handleError<Vehiculo>(`getVehiculo id=${id}`))
    );
  }

  /* GET vehiculos whose name contains search term */
  searchVehiculos(term: string): Observable<Vehiculo[]> {
    if (!term.trim()) {
      // if not search term, return empty vehiculo array.
      return of([]);
    }
    return this.http.get<Vehiculo[]>(`${this.url}/?name=${term}`).pipe(
      tap(_ => this.log(`found vehiculos matching "${term}"`)),
      catchError(this.handleError<Vehiculo[]>('searchVehiculos', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new vehiculo to the server */
  addVehiculo(vehiculo: Vehiculo): Observable<Vehiculo> {
    return this.http.post<Vehiculo>(this.url + '/insertvehiculo', JSON.stringify(vehiculo)).pipe(
      tap((newVehiculo: Vehiculo) => this.log(`added vehiculo w/ id=${newVehiculo.IDVehiculo}`)),
      catchError(this.handleError<Vehiculo>('addVehiculo'))
    );
  }



  /** PUT: update the vehiculo on the server */
  updateVehiculo(vehiculo: Vehiculo): Observable<any> {
    return this.http.put( this.url + '/updatevehiculo', JSON.stringify(vehiculo), httpOptions
    ).pipe(
      tap(_ => this.log(`updated vehiculo id=${vehiculo.IDVehiculo}`)),
      catchError(this.handleError<any>('updateVehiculo'))
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

  /** Log a VehiculoService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`VehiculoService: ${message}`);
  }
}

