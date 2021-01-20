import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


import { MessageService } from './message.service';
import { Programa } from '../model/programa';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MapaService {


  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  url = environment.base_Url1;


  getDireccion(term: String): Observable<any[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<any>('https://maps.googleapis.com/maps/api/geocode/json', { params: { 'address': "'" + term + "'", 'key': 'AIzaSyDw7fcF8mx_xw-3v2jRnYwsYnkyMGdBKnA' } })
      .pipe(
        tap(_ => this.log('fetched Mapas')),
        catchError(this.handleError('getMapas', []))
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

  /** Log a ProgramaService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`ProgramaService: ${message}`);
  }
}

