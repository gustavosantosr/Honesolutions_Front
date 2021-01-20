import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { VehiculoMarca } from '../model/vehiculoMarca';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class VehiculomarcaService {


  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  url = environment.base_Url1;

  /** GET vehiculomarcas from the server */
  getVehiculoMarcas(): Observable<VehiculoMarca[]> {
    return this.http.get<VehiculoMarca[]>(this.url + '/getvehiculomarca')
      .pipe(
        tap(_ => this.log('fetched vehiculomarcas')),
        catchError(this.handleError('getVehiculoMarcas', []))
      );
  }

  getVehiculoMarcasFilter(term: String): Observable<VehiculoMarca[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<VehiculoMarca[]>(this.url + 'VehiculoMarcasQ.php', { params: { 'comando': 'query1', 'where': 'and vehiculomarca_marca like "%' + term + '%"' } })
      .pipe(
        tap(_ => this.log('fetched vehiculomarcas')),
        catchError(this.handleError('getVehiculoMarcas', []))
      );
  }

  /** GET vehiculomarca by id. Return `undefined` when id not found */
  getVehiculoMarcaNo404<Data>(id: number): Observable<VehiculoMarca> {
    const url = `${ this.url }/?id=${id}`;
    return this.http.get<VehiculoMarca[]>(url)
      .pipe(
        map(vehiculomarcas => vehiculomarcas[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} vehiculomarca id=${id}`);
        }),
        catchError(this.handleError<VehiculoMarca>(`getVehiculoMarca id=${id}`))
      );
  }

  /** GET vehiculomarca by id. Will 404 if id not found */
  getVehiculoMarca(id: number): Observable<VehiculoMarca> {
    // const url = `${this.vehiculomarcasUrl}/${id}`;
    return this.http.get<VehiculoMarca>(this.url + 'VehiculoMarcasQ.php?comando=queryById&where= and id_vehiculomarca_marca=' + id).pipe(
      tap(_ => this.log(`fetched vehiculomarca id=${id}`)),
      catchError(this.handleError<VehiculoMarca>(`getVehiculoMarca id=${id}`))
    );
  }

  /* GET vehiculomarcas whose name contains search term */
  searchVehiculoMarcas(term: string): Observable<VehiculoMarca[]> {
    if (!term.trim()) {
      // if not search term, return empty vehiculomarca array.
      return of([]);
    }
    return this.http.get<VehiculoMarca[]>(`${this.url}/?name=${term}`).pipe(
      tap(_ => this.log(`found vehiculomarcas matching "${term}"`)),
      catchError(this.handleError<VehiculoMarca[]>('searchVehiculoMarcas', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new vehiculomarca to the server */
  addVehiculoMarca(vehiculomarca: VehiculoMarca): Observable<VehiculoMarca> {
    return this.http.post<VehiculoMarca>(this.url + '/insertvehiculomarca', JSON.stringify(vehiculomarca)).pipe(
      tap((newVehiculoMarca: VehiculoMarca) => this.log(`added vehiculomarca w/ id=${newVehiculoMarca.IDVehiculoMarca}`)),
      catchError(this.handleError<VehiculoMarca>('addVehiculoMarca'))
    );
  }



  /** PUT: update the vehiculomarca on the server */
  updateVehiculoMarca(vehiculomarca: VehiculoMarca): Observable<any> {
    return this.http.put( this.url + '/updatevehiculomarca', JSON.stringify(vehiculomarca), httpOptions
    ).pipe(
      tap(_ => this.log(`updated vehiculomarca id=${vehiculomarca.IDVehiculoMarca}`)),
      catchError(this.handleError<any>('updateVehiculoMarca'))
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

  /** Log a VehiculoMarcaService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`VehiculoMarcaService: ${message}`);
  }
}
