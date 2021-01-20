import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { SangreTipo } from '../model/sangreTipo';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class SangretipoService {


  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  url = environment.base_Url1;

  /** GET sangretipos from the server */
  getSangreTipos(): Observable<SangreTipo[]> {
    return this.http.get<SangreTipo[]>(this.url + '/getsangretipo')
      .pipe(
        tap(_ => this.log('fetched sangretipos')),
        catchError(this.handleError('getSangreTipos', []))
      );
  }

  getSangreTiposFilter(term: String): Observable<SangreTipo[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<SangreTipo[]>(this.url + 'SangreTiposQ.php', { params: { 'comando': 'query1', 'where': 'and sangretipo_tipo like "%' + term + '%"' } })
      .pipe(
        tap(_ => this.log('fetched sangretipos')),
        catchError(this.handleError('getSangreTipos', []))
      );
  }

  /** GET sangretipo by id. Return `undefined` when id not found */
  getSangreTipoNo404<Data>(id: number): Observable<SangreTipo> {
    const url = `${ this.url }/?id=${id}`;
    return this.http.get<SangreTipo[]>(url)
      .pipe(
        map(sangretipos => sangretipos[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} sangretipo id=${id}`);
        }),
        catchError(this.handleError<SangreTipo>(`getSangreTipo id=${id}`))
      );
  }

  /** GET sangretipo by id. Will 404 if id not found */
  getSangreTipo(id: number): Observable<SangreTipo> {
    // const url = `${this.sangretiposUrl}/${id}`;
    return this.http.get<SangreTipo>(this.url + 'SangreTiposQ.php?comando=queryById&where= and id_sangretipo_tipo=' + id).pipe(
      tap(_ => this.log(`fetched sangretipo id=${id}`)),
      catchError(this.handleError<SangreTipo>(`getSangreTipo id=${id}`))
    );
  }

  /* GET sangretipos whose name contains search term */
  searchSangreTipos(term: string): Observable<SangreTipo[]> {
    if (!term.trim()) {
      // if not search term, return empty sangretipo array.
      return of([]);
    }
    return this.http.get<SangreTipo[]>(`${this.url}/?name=${term}`).pipe(
      tap(_ => this.log(`found sangretipos matching "${term}"`)),
      catchError(this.handleError<SangreTipo[]>('searchSangreTipos', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new sangretipo to the server */
  addSangreTipo(sangretipo: SangreTipo): Observable<SangreTipo> {
    return this.http.post<SangreTipo>(this.url + '/insertsangretipo', JSON.stringify(sangretipo)).pipe(
      tap((newSangreTipo: SangreTipo) => this.log(`added sangretipo w/ id=${newSangreTipo.IDSangreTipo}`)),
      catchError(this.handleError<SangreTipo>('addSangreTipo'))
    );
  }



  /** PUT: update the sangretipo on the server */
  updateSangreTipo(sangretipo: SangreTipo): Observable<any> {
    return this.http.put( this.url + '/updatesangretipo', JSON.stringify(sangretipo), httpOptions
    ).pipe(
      tap(_ => this.log(`updated sangretipo id=${sangretipo.IDSangreTipo}`)),
      catchError(this.handleError<any>('updateSangreTipo'))
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

  /** Log a SangreTipoService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`SangreTipoService: ${message}`);
  }
}
