import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Ciudad } from '../model/ciudad';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CiudadService {
  private ciudadesUrl = 'https://www.drmonkey.co/daltex_data/CiudadesQ.php';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  url = environment.base_Url1;
  /** GET ciudades from the server */
  getCiudades(): Observable<Ciudad[]> {
    return this.http.get<Ciudad[]>(this.url + '/getciudad')
      .pipe(
        tap(_ => this.log('fetched ciudades')),
        catchError(this.handleError('getCiudades', []))
      );
  }
  /** GET ciudades from the server */
  getCiudadesActivo(): Observable<Ciudad[]> {
    return this.http.get<Ciudad[]>(this.url + '/getciudadactivo')
      .pipe(
        tap(_ => this.log('fetched ciudades')),
        catchError(this.handleError('getCiudades', []))
      );
  }
  /** GET ciudades from the server */
  getCiudadesInactivo(): Observable<Ciudad[]> {
    return this.http.get<Ciudad[]>(this.url + '/getciudadinactivo')
      .pipe(
        tap(_ => this.log('fetched ciudades')),
        catchError(this.handleError('getCiudades', []))
      );
  }
  /** GET ciudades from the server */
  getOperarios(): Observable<Ciudad[]> {
    return this.http.get<Ciudad[]>(this.url + '/getoperario')
      .pipe(
        tap(_ => this.log('fetched ciudades')),
        catchError(this.handleError('getCiudades', []))
      );
  }
  getInventario(): Observable<Ciudad[]> {
    return this.http.get<Ciudad[]>(this.url + 'CiudadesQ.php?comando=report')
      .pipe(
        tap(_ => this.log('fetched ciudades')),
        catchError(this.handleError('getCiudades', []))
      );
  }

  getCiudadesFilter(term: String): Observable<Ciudad[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<Ciudad[]>(this.url + 'CiudadesQ.php?', { params: { 'comando': 'query1', 'where': ' and i.insumo like "%' + term + '%"' } })
      .pipe(
        tap(_ => this.log('fetched ciudades')),
        catchError(this.handleError('getCiudades', []))
      );
  }
  getCiudadesdateFilter(term: String): Observable<Ciudad[]> {
    return this.http.get<Ciudad[]>(this.url + 'CiudadesQ.php?', { params: { 'comando': 'query1', 'where': ' and c.fecha= "' + term + '"' } })
      .pipe(
        tap(_ => this.log('fetched ciudades')),
        catchError(this.handleError('getCiudades', []))
      );
  }

  /** GET ciudad by id. Return `undefined` when id not found */
  getCiudadNo404<Data>(id: number): Observable<Ciudad> {
    const url = `${this.ciudadesUrl}/?id=${id}`;
    return this.http.get<Ciudad[]>(url)
      .pipe(
        map(ciudades => ciudades[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} ciudad id=${id}`);
        }),
        catchError(this.handleError<Ciudad>(`getCiudad id=${id}`))
      );
  }

  /** GET ciudad by id. Will 404 if id not found */
  getCiudad(id: number): Observable<Ciudad[]> {
    const url = `${this.ciudadesUrl}/${id}`;
    return this.http.get<Ciudad[]>(this.url + 'CiudadesQ.php?comando=queryById&where= and IDCiudad=' + id).pipe(
      tap(_ => this.log(`fetched ciudad id=${id}`)),
      catchError(this.handleError<Ciudad[]>(`getCiudad id=${id}`))
    );
  }
  /** GET ciudad by id. Will 404 if id not found */
  getCiudadbyDepartamento(id: number): Observable<Ciudad[]> {
    const url = `${this.ciudadesUrl}/${id}`;
    return this.http.get<Ciudad[]>(this.url + '/getciudadbydepartamento?IDDepartamento=' + id).pipe(
      tap(_ => this.log(`fetched ciudad id=${id}`)),
      catchError(this.handleError<Ciudad[]>(`getCiudad id=${id}`))
    );
  }

  /* GET ciudades whose name contains search term */
  searchCiudades(term: string): Observable<Ciudad[]> {
    if (!term.trim()) {
      // if not search term, return empty ciudad array.
      return of([]);
    }
    return this.http.get<Ciudad[]>(`${this.ciudadesUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found ciudades matching "${term}"`)),
      catchError(this.handleError<Ciudad[]>('searchCiudades', []))
    );
  }

  //////// Save methods //////////

 /** POST: add a new ciudad to the server */
 addCiudad(ciudad: Ciudad): Observable<Ciudad> {
  return this.http.post<Ciudad>(this.url + '/insertciudad', JSON.stringify(ciudad)).pipe(
    tap((newCiudad: Ciudad) => this.log(`added ciudad w/ id=${newCiudad.IDCiudad}`)),
    catchError(this.handleError<Ciudad>('addCiudad'))
  );
}

  /** DELETE: delete the ciudad from the server */
  deleteCiudad(ciudad: Ciudad | number): Observable<Ciudad> {
    const id = typeof ciudad === 'number' ? ciudad : ciudad.IDCiudad;
    const url = `${this.ciudadesUrl}/${id}`;

    return this.http.delete<Ciudad>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted ciudad id=${id}`)),
      catchError(this.handleError<Ciudad>('deleteCiudad'))
    );
  }

   /** PUT: update the ciudad on the server */
   updateCiudad(ciudad: Ciudad): Observable<any> {
    return this.http.put( this.url + '/updateciudad', JSON.stringify(ciudad), httpOptions
    ).pipe(
      tap(_ => this.log(`updated ciudad id=${ciudad.IDCiudad}`)),
      catchError(this.handleError<any>('updateCiudad'))
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

  /** Log a CiudadService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`CiudadService: ${message}`);
  }
}


