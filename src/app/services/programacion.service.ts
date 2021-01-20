import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Programacion } from '../model/Programacion';
import { MessageService } from './message.service';
import { ProgramacionDto } from '../dtos/programacionDto';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ProgramacionService {


  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  url = environment.base_Url1;

  /** GET programacions from the server */
  getProgramaciones(): Observable<Programacion[]> {
    return this.http.get<Programacion[]>(this.url + '/getprogramacion')
      .pipe(
        tap(_ => this.log('fetched programacions')),
        catchError(this.handleError('getProgramaciones', []))
      );
  }

  getProgramacionesFilter(term: String): Observable<Programacion[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<Programacion[]>(this.url + 'ProgramacionesQ.php', { params: { 'comando': 'query1', 'where': 'and programacion_tipo like "%' + term + '%"' } })
      .pipe(
        tap(_ => this.log('fetched programacions')),
        catchError(this.handleError('getProgramaciones', []))
      );
  }

  /** GET programacion by id. Return `undefined` when id not found */
  getProgramacionNo404<Data>(id: number): Observable<Programacion> {
    const url = `${ this.url }/?id=${id}`;
    return this.http.get<Programacion[]>(url)
      .pipe(
        map(programacions => programacions[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} programacion id=${id}`);
        }),
        catchError(this.handleError<Programacion>(`getProgramacion id=${id}`))
      );
  }

  /** GET programacion by id. Will 404 if id not found */
  getProgramacion(id: number): Observable<Programacion> {
    // const url = `${this.programacionsUrl}/${id}`;
    return this.http.get<Programacion>(this.url + 'ProgramacionesQ.php?comando=queryById&where= and id_programacion_tipo=' + id).pipe(
      tap(_ => this.log(`fetched programacion id=${id}`)),
      catchError(this.handleError<Programacion>(`getProgramacion id=${id}`))
    );
  }

  /* GET programacions whose name contains search term */
  searchProgramaciones(term: string): Observable<Programacion[]> {
    if (!term.trim()) {
      // if not search term, return empty programacion array.
      return of([]);
    }
    return this.http.get<Programacion[]>(`${this.url}/?name=${term}`).pipe(
      tap(_ => this.log(`found programacions matching "${term}"`)),
      catchError(this.handleError<Programacion[]>('searchProgramaciones', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new programacion to the server */
  addProgramacion(programacion: ProgramacionDto): Observable<ProgramacionDto> {
    return this.http.post<ProgramacionDto>(this.url + '/insertprogramacion', JSON.stringify(programacion)).pipe(
      tap((newProgramacionDto: ProgramacionDto) => this.log(`added programacion w/ id=${newProgramacionDto.IDConductor}`)),
      catchError(this.handleError<ProgramacionDto>('addProgramacionDto'))
    );
  }



  /** PUT: update the programacion on the server */
  updateProgramacion(programacion: Programacion): Observable<any> {
    return this.http.put( this.url + '/updateprogramacion', JSON.stringify(programacion), httpOptions
    ).pipe(
      tap(_ => this.log(`updated programacion id=${programacion.IDProgramacion}`)),
      catchError(this.handleError<any>('updateProgramacion'))
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

  /** Log a ProgramacionService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`ProgramacionService: ${message}`);
  }
}