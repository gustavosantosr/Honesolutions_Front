import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Rol } from '../model/rol';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private rolesUrl = 'https://www.drmonkey.co/daltex_data/RolesQ.php';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  url = environment.base_Url1;
  /** GET roles from the server */
  getRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.url + '/getRoles')
      .pipe(
        tap(_ => this.log('fetched roles')),
        catchError(this.handleError('getRoles', []))
      );
  }
  /** GET roles from the server */
  getOperarios(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.url + '/getoperario')
      .pipe(
        tap(_ => this.log('fetched roles')),
        catchError(this.handleError('getRoles', []))
      );
  }
  getInventario(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.url + 'RolesQ.php?comando=report')
      .pipe(
        tap(_ => this.log('fetched roles')),
        catchError(this.handleError('getRoles', []))
      );
  }

  getRolesFilter(term: String): Observable<Rol[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<Rol[]>(this.url + 'RolesQ.php?', { params: { 'comando': 'query1', 'where': ' and i.insumo like "%' + term + '%"' } })
      .pipe(
        tap(_ => this.log('fetched roles')),
        catchError(this.handleError('getRoles', []))
      );
  }
  getRolesdateFilter(term: String): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.url + 'RolesQ.php?', { params: { 'comando': 'query1', 'where': ' and c.fecha= "' + term + '"' } })
      .pipe(
        tap(_ => this.log('fetched roles')),
        catchError(this.handleError('getRoles', []))
      );
  }

  /** GET rol by id. Return `undefined` when id not found */
  getRolNo404<Data>(id: number): Observable<Rol> {
    const url = `${this.rolesUrl}/?id=${id}`;
    return this.http.get<Rol[]>(url)
      .pipe(
        map(roles => roles[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} rol id=${id}`);
        }),
        catchError(this.handleError<Rol>(`getRol id=${id}`))
      );
  }

  /** GET rol by id. Will 404 if id not found */
  getRol(id: number): Observable<Rol> {
    const url = `${this.rolesUrl}/${id}`;
    return this.http.get<Rol>(this.url + 'RolesQ.php?comando=queryById&where= and IDRol=' + id).pipe(
      tap(_ => this.log(`fetched rol id=${id}`)),
      catchError(this.handleError<Rol>(`getRol id=${id}`))
    );
  }

  /* GET roles whose name contains search term */
  searchRoles(term: string): Observable<Rol[]> {
    if (!term.trim()) {
      // if not search term, return empty rol array.
      return of([]);
    }
    return this.http.get<Rol[]>(`${this.rolesUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found roles matching "${term}"`)),
      catchError(this.handleError<Rol[]>('searchRoles', []))
    );
  }

  //////// Save methods //////////

 /** POST: add a new rol to the server */
 addRol(rol: Rol): Observable<Rol> {
  return this.http.post<Rol>(this.url + '/insertRol', JSON.stringify(rol)).pipe(
    tap((newRol: Rol) => this.log(`added rol w/ id=${newRol.IDRol}`)),
    catchError(this.handleError<Rol>('addRol'))
  );
}

  /** DELETE: delete the rol from the server */
  deleteRol(rol: Rol | number): Observable<Rol> {
    const id = typeof rol === 'number' ? rol : rol.IDRol;
    const url = `${this.rolesUrl}/${id}`;

    return this.http.delete<Rol>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted rol id=${id}`)),
      catchError(this.handleError<Rol>('deleteRol'))
    );
  }

   /** PUT: update the rol on the server */
   updateRol(rol: Rol): Observable<any> {
    return this.http.put( this.url + '/updateRol', JSON.stringify(rol), httpOptions
    ).pipe(
      tap(_ => this.log(`updated rol id=${rol.IDRol}`)),
      catchError(this.handleError<any>('updateRol'))
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

  /** Log a RolService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`RolService: ${message}`);
  }
}



