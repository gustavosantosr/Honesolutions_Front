import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Usuario } from '../model/usuario';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuariosUrl = 'https://www.drmonkey.co/daltex_data/UsuariosQ.php';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  url = environment.base_Url1;
  /** GET usuarios from the server */
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url + '/getUsuarios')
      .pipe(
        tap(_ => this.log('fetched usuarios')),
        catchError(this.handleError('getUsuarios', []))
      );
  }
  /** GET usuarios from the server */
  getOperarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url + '/getoperario')
      .pipe(
        tap(_ => this.log('fetched usuarios')),
        catchError(this.handleError('getUsuarios', []))
      );
  }
  getInventario(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url + 'UsuariosQ.php?comando=report')
      .pipe(
        tap(_ => this.log('fetched usuarios')),
        catchError(this.handleError('getUsuarios', []))
      );
  }

  getUsuariosFilter(term: String): Observable<Usuario[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<Usuario[]>(this.url + 'UsuariosQ.php?', { params: { 'comando': 'query1', 'where': ' and i.insumo like "%' + term + '%"' } })
      .pipe(
        tap(_ => this.log('fetched usuarios')),
        catchError(this.handleError('getUsuarios', []))
      );
  }
  getUsuariosdateFilter(term: String): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url + 'UsuariosQ.php?', { params: { 'comando': 'query1', 'where': ' and c.fecha= "' + term + '"' } })
      .pipe(
        tap(_ => this.log('fetched usuarios')),
        catchError(this.handleError('getUsuarios', []))
      );
  }

  /** GET usuario by id. Return `undefined` when id not found */
  getUsuarioNo404<Data>(id: number): Observable<Usuario> {
    const url = `${this.usuariosUrl}/?id=${id}`;
    return this.http.get<Usuario[]>(url)
      .pipe(
        map(usuarios => usuarios[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} usuario id=${id}`);
        }),
        catchError(this.handleError<Usuario>(`getUsuario id=${id}`))
      );
  }

  /** GET usuario by id. Will 404 if id not found */
  getUsuario(id: number): Observable<Usuario> {
    const url = `${this.usuariosUrl}/${id}`;
    return this.http.get<Usuario>(this.url + 'UsuariosQ.php?comando=queryById&where= and IDUsuario=' + id).pipe(
      tap(_ => this.log(`fetched usuario id=${id}`)),
      catchError(this.handleError<Usuario>(`getUsuario id=${id}`))
    );
  }

  /* GET usuarios whose name contains search term */
  searchUsuarios(term: string): Observable<Usuario[]> {
    if (!term.trim()) {
      // if not search term, return empty usuario array.
      return of([]);
    }
    return this.http.get<Usuario[]>(`${this.usuariosUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found usuarios matching "${term}"`)),
      catchError(this.handleError<Usuario[]>('searchUsuarios', []))
    );
  }

  //////// Save methods //////////

  
   /** POST: add a new usuario to the server */
   addUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.url + '/insertusuario', JSON.stringify(usuario), httpOptions).pipe(
      tap((newUsuario: Usuario) => this.log(`added usuario w/ id=${newUsuario.IDUsuario}`)),
      catchError(this.handleError<Usuario>('addUsuario'))
    );
  }

  /** DELETE: delete the usuario from the server */
  deleteUsuario(usuario: Usuario | number): Observable<Usuario> {
    const id = typeof usuario === 'number' ? usuario : usuario.IDUsuario;
    const url = `${this.usuariosUrl}/${id}`;

    return this.http.delete<Usuario>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted usuario id=${id}`)),
      catchError(this.handleError<Usuario>('deleteUsuario'))
    );
  }

  /** PUT: update the usuario on the server */
  updateUsuario(usuario: Usuario): Observable<any> {
    return this.http.put( this.url + '/updateusuario', JSON.stringify(usuario), httpOptions
    ).pipe(
      tap(_ => this.log(`updated usuario id=${usuario.IDUsuario}`)),
      catchError(this.handleError<any>('updateUsuario'))
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

  /** Log a UsuarioService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`UsuarioService: ${message}`);
  }
}
