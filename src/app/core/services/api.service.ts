import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  private formatErrors(error: any) {
    return throwError(() => error);
  }

  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http.get<T>(`${environment.apiUrl}${path}`, { params })
      .pipe(catchError(this.formatErrors));
  }

  put<T>(path: string, body: object = {}): Observable<T> {
    return this.http.put<T>(
      `${environment.apiUrl}${path}`,
      JSON.stringify(body),
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).pipe(catchError(this.formatErrors));
  }

  post<T>(path: string, body: object = {}): Observable<T> {
    return this.http.post<T>(
      `${environment.apiUrl}${path}`,
      JSON.stringify(body),
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).pipe(catchError(this.formatErrors));
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${environment.apiUrl}${path}`)
      .pipe(catchError(this.formatErrors));
  }

  // For multipart/form-data requests (file uploads)
  postFormData<T>(path: string, formData: FormData): Observable<T> {
    return this.http.post<T>(`${environment.apiUrl}${path}`, formData)
      .pipe(catchError(this.formatErrors));
  }

  putFormData<T>(path: string, formData: FormData): Observable<T> {
    return this.http.put<T>(`${environment.apiUrl}${path}`, formData)
      .pipe(catchError(this.formatErrors));
  }
}
