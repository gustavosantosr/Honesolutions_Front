import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Tarifa, TarifaPrestador, TarifaReport, TarifaServicio, TarifaVigencia } from '../model/tarifa';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TarifaService {


  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  url = environment.base_Url1;

  /** GET tarifas from the server */
  getTarifas(): Observable<Tarifa[]> {
    return this.http.get<Tarifa[]>(this.url + '/gettarifa')
      .pipe(
        tap(_ => this.log('fetched tarifas')),
        catchError(this.handleError('getTarifas', []))
      );
  }
  /** GET tarifas from the server */
  generateTarifas(IDTarifa: number): Observable<Tarifa[]> {
    return this.http.get<Tarifa[]>(this.url + '/createtarifasbyidvigencia?IDTarifaVigencia=' + IDTarifa)
      .pipe(
        tap(_ => this.log('fetched tarifas')),
        catchError(this.handleError('getTarifas', []))
      );
  }
  /** GET tarifas from the server */
  getTarifaVigencias(): Observable<TarifaVigencia[]> {
    return this.http.get<TarifaVigencia[]>(this.url + '/gettarifavigencia')
      .pipe(
        tap(_ => this.log('fetched tarifas')),
        catchError(this.handleError('getTarifas', []))
      );
  }
  /** GET tarifas from the server */
  getTarifasReporte(): Observable<TarifaReport[]> {
    return this.http.get<TarifaReport[]>(this.url + '/gettarifareporte')
      .pipe(
        tap(_ => this.log('fetched tarifas')),
        catchError(this.handleError('getTarifas', []))
      );
  }
  /** GET tarifas from the server */
  getTarifasbyIDPrestador(IDPrestador: number): Observable<TarifaServicio[]> {
    return this.http.get<TarifaServicio[]>(this.url + '/gettarifaprestadorbyidprestador?IDPrestador=' + IDPrestador)
      .pipe(
        tap(_ => this.log('fetched tarifas')),
        catchError(this.handleError('getTarifas', []))
      );
  }

  getTarifasFilter(term: String): Observable<Tarifa[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<Tarifa[]>(this.url + 'TarifasQ.php', { params: { 'comando': 'query1', 'where': 'and tarifa_tipo like "%' + term + '%"' } })
      .pipe(
        tap(_ => this.log('fetched tarifas')),
        catchError(this.handleError('getTarifas', []))
      );
  }

  /** GET tarifa by id. Return `undefined` when id not found */
  getTarifaNo404<Data>(id: number): Observable<Tarifa> {
    const url = `${this.url}/?id=${id}`;
    return this.http.get<Tarifa[]>(url)
      .pipe(
        map(tarifas => tarifas[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} tarifa id=${id}`);
        }),
        catchError(this.handleError<Tarifa>(`getTarifa id=${id}`))
      );
  }

  /** GET tarifa by id. Will 404 if id not found */
  getTarifa(id: number): Observable<Tarifa> {
    // const url = `${this.tarifasUrl}/${id}`;
    return this.http.get<Tarifa>(this.url + 'TarifasQ.php?comando=queryById&where= and id_tarifa_tipo=' + id).pipe(
      tap(_ => this.log(`fetched tarifa id=${id}`)),
      catchError(this.handleError<Tarifa>(`getTarifa id=${id}`))
    );
  }

  /* GET tarifas whose name contains search term */
  searchTarifas(term: string): Observable<Tarifa[]> {
    if (!term.trim()) {
      // if not search term, return empty tarifa array.
      return of([]);
    }
    return this.http.get<Tarifa[]>(`${this.url}/?name=${term}`).pipe(
      tap(_ => this.log(`found tarifas matching "${term}"`)),
      catchError(this.handleError<Tarifa[]>('searchTarifas', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new tarifa to the server */
  addTarifa(tarifa: Tarifa): Observable<Tarifa> {
    return this.http.post<Tarifa>(this.url + '/inserttarifa', JSON.stringify(tarifa), httpOptions).pipe(
      tap((newTarifa: Tarifa) => this.log(`added tarifa w/ id=${newTarifa.IDTarifa}`)),
      catchError(this.handleError<Tarifa>('addTarifa'))
    );
  }
  /** POST: add a new tarifa to the server */
  addTarifaVigencia(tarifa: TarifaVigencia): Observable<TarifaVigencia> {
    return this.http.post<TarifaVigencia>(this.url + '/inserttarifavigencia', JSON.stringify(tarifa), httpOptions).pipe(
      tap((newTarifa: TarifaVigencia) => this.log(`added tarifa w/ id=${newTarifa.IDTarifaVigencia}`)),
      catchError(this.handleError<TarifaVigencia>('addTarifa'))
    );
  }



  /** PUT: update the tarifa on the server */
  updateTarifa(tarifa: Tarifa): Observable<any> {
    return this.http.put(this.url + '/updatetarifa', JSON.stringify(tarifa), httpOptions
    ).pipe(
      tap(_ => this.log(`updated tarifa id=${tarifa.IDTarifa}`)),
      catchError(this.handleError<any>('updateTarifa'))
    );
  }
  /** PUT: update the tarifa on the server */
  updateTarifaPrestador(tarifa: TarifaPrestador): Observable<any> {
    return this.http.put(this.url + '/updatetarifaprestador', JSON.stringify(tarifa), httpOptions
    ).pipe(
      tap(_ => this.log(`updated tarifa id=${tarifa.IDTarifa}`)),
      catchError(this.handleError<any>('updateTarifa'))
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

  /** Log a TarifaService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`TarifaService: ${message}`);
  }
}

