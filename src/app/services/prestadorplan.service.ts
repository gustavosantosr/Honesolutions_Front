import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { PrestadorPlan } from '../model/prestadorPlan';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ActividadtipoService {


  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  url = environment.base_Url1;

  /** GET prestadorplanes from the server */
  getPrestadorPlanes(): Observable<PrestadorPlan[]> {
    return this.http.get<PrestadorPlan[]>(this.url + '/getprestadorplan')
      .pipe(
        tap(_ => this.log('fetched prestadorplanes')),
        catchError(this.handleError('getPrestadorPlanes', []))
      );
  }

  getPrestadorPlanesFilter(term: String): Observable<PrestadorPlan[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<PrestadorPlan[]>(this.url + 'PrestadorPlanesQ.php', { params: { 'comando': 'query1', 'where': 'and prestadorplan_tipo like "%' + term + '%"' } })
      .pipe(
        tap(_ => this.log('fetched prestadorplanes')),
        catchError(this.handleError('getPrestadorPlanes', []))
      );
  }

  /** GET prestadorplan by id. Return `undefined` when id not found */
  getPrestadorPlanNo404<Data>(id: number): Observable<PrestadorPlan> {
    const url = `${ this.url }/?id=${id}`;
    return this.http.get<PrestadorPlan[]>(url)
      .pipe(
        map(prestadorplanes => prestadorplanes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} prestadorplan id=${id}`);
        }),
        catchError(this.handleError<PrestadorPlan>(`getPrestadorPlan id=${id}`))
      );
  }

  /** GET prestadorplan by id. Will 404 if id not found */
  getPrestadorPlan(id: number): Observable<PrestadorPlan> {
    // const url = `${this.prestadorplanesUrl}/${id}`;
    return this.http.get<PrestadorPlan>(this.url + 'PrestadorPlanesQ.php?comando=queryById&where= and id_prestadorplan_tipo=' + id).pipe(
      tap(_ => this.log(`fetched prestadorplan id=${id}`)),
      catchError(this.handleError<PrestadorPlan>(`getPrestadorPlan id=${id}`))
    );
  }

  /* GET prestadorplanes whose name contains search term */
  searchPrestadorPlanes(term: string): Observable<PrestadorPlan[]> {
    if (!term.trim()) {
      // if not search term, return empty prestadorplan array.
      return of([]);
    }
    return this.http.get<PrestadorPlan[]>(`${this.url}/?name=${term}`).pipe(
      tap(_ => this.log(`found prestadorplanes matching "${term}"`)),
      catchError(this.handleError<PrestadorPlan[]>('searchPrestadorPlanes', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new prestadorplan to the server */
  addPrestadorPlan(prestadorplan: PrestadorPlan): Observable<PrestadorPlan> {
    return this.http.post<PrestadorPlan>(this.url + '/insertprestadorplan', JSON.stringify(prestadorplan)).pipe(
      tap((newPrestadorPlan: PrestadorPlan) => this.log(`added prestadorplan w/ id=${newPrestadorPlan.IDPrestadorPlan}`)),
      catchError(this.handleError<PrestadorPlan>('addPrestadorPlan'))
    );
  }



  /** PUT: update the prestadorplan on the server */
  updatePrestadorPlan(prestadorplan: PrestadorPlan): Observable<any> {
    return this.http.put( this.url + '/updateprestadorplan', JSON.stringify(prestadorplan), httpOptions
    ).pipe(
      tap(_ => this.log(`updated prestadorplan id=${prestadorplan.IDPrestadorPlan}`)),
      catchError(this.handleError<any>('updatePrestadorPlan'))
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

  /** Log a PrestadorPlanService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`PrestadorPlanService: ${message}`);
  }
}