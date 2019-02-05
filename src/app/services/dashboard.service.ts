import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private BASE_URL: string = environment.BASE_URL;
  private headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient) { }
  getRegistrants(query?: string): Observable<object[]> {
    return this.http.get<object[]>(`${this.BASE_URL}/registrants`);
  }
  getStats() {
    return this.http.get(`${this.BASE_URL}/stats`);
  }
}
