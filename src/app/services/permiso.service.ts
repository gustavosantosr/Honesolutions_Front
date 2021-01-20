import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Permiso } from '../model/permiso';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PermisoService {
  private permisosUrl = 'https://www.drmonkey.co/daltex_data/PermisosQ.php';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  url = environment.base_Url1;
  /** GET permisos from the server */
  getPermisos(): Observable<Permiso[]> {
    return this.http.get<Permiso[]>(this.url + '/getPermisos')
      .pipe(
        tap(_ => this.log('fetched permisos')),
        catchError(this.handleError('getPermisos', []))
      );
  }
  /** GET permisos from the server */
  getOperarios(): Observable<Permiso[]> {
    return this.http.get<Permiso[]>(this.url + '/getoperario')
      .pipe(
        tap(_ => this.log('fetched permisos')),
        catchError(this.handleError('getPermisos', []))
      );
  }
  getInventario(): Observable<Permiso[]> {
    return this.http.get<Permiso[]>(this.url + 'PermisosQ.php?comando=report')
      .pipe(
        tap(_ => this.log('fetched permisos')),
        catchError(this.handleError('getPermisos', []))
      );
  }

  getPermisosFilter(term: String): Observable<Permiso[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<Permiso[]>(this.url + 'PermisosQ.php?', { params: { 'comando': 'query1', 'where': ' and i.insumo like "%' + term + '%"' } })
      .pipe(
        tap(_ => this.log('fetched permisos')),
        catchError(this.handleError('getPermisos', []))
      );
  }
  getPermisosdateFilter(term: String): Observable<Permiso[]> {
    return this.http.get<Permiso[]>(this.url + 'PermisosQ.php?', { params: { 'comando': 'query1', 'where': ' and c.fecha= "' + term + '"' } })
      .pipe(
        tap(_ => this.log('fetched permisos')),
        catchError(this.handleError('getPermisos', []))
      );
  }

  /** GET permiso by id. Return `undefined` when id not found */
  getPermisoNo404<Data>(id: number): Observable<Permiso> {
    const url = `${this.permisosUrl}/?id=${id}`;
    return this.http.get<Permiso[]>(url)
      .pipe(
        map(permisos => permisos[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} permiso id=${id}`);
        }),
        catchError(this.handleError<Permiso>(`getPermiso id=${id}`))
      );
  }

  /** GET permiso by id. Will 404 if id not found */
  getPermiso(id: number): Observable<Permiso> {
    const url = `${this.permisosUrl}/${id}`;
    return this.http.get<Permiso>(this.url + 'PermisosQ.php?comando=queryById&where= and IDPermiso=' + id).pipe(
      tap(_ => this.log(`fetched permiso id=${id}`)),
      catchError(this.handleError<Permiso>(`getPermiso id=${id}`))
    );
  }

  /* GET permisos whose name contains search term */
  searchPermisos(term: string): Observable<Permiso[]> {
    if (!term.trim()) {
      // if not search term, return empty permiso array.
      return of([]);
    }
    return this.http.get<Permiso[]>(`${this.permisosUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found permisos matching "${term}"`)),
      catchError(this.handleError<Permiso[]>('searchPermisos', []))
    );
  }

  //////// Save methods //////////

 /** POST: add a new permiso to the server */
 addPermiso(permiso: Permiso): Observable<Permiso> {
  return this.http.post<Permiso>(this.url + '/insertPermiso', JSON.stringify(permiso)).pipe(
    tap((newPermiso: Permiso) => this.log(`added permiso w/ id=${newPermiso.IDPermiso}`)),
    catchError(this.handleError<Permiso>('addPermiso'))
  );
}

  /** DELETE: delete the permiso from the server */
  deletePermiso(permiso: Permiso | number): Observable<Permiso> {
    const id = typeof permiso === 'number' ? permiso : permiso.IDPermiso;
    const url = `${this.permisosUrl}/${id}`;

    return this.http.delete<Permiso>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted permiso id=${id}`)),
      catchError(this.handleError<Permiso>('deletePermiso'))
    );
  }

   /** PUT: update the permiso on the server */
   updatePermiso(permiso: Permiso): Observable<any> {
    return this.http.put( this.url + '/updatePermiso', JSON.stringify(permiso), httpOptions
    ).pipe(
      tap(_ => this.log(`updated permiso id=${permiso.IDPermiso}`)),
      catchError(this.handleError<any>('updatePermiso'))
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

  /** Log a PermisoService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`PermisoService: ${message}`);
  }
}