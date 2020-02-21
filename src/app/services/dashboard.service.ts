import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private BASE_URL: string = environment.BASE_URL;
  private headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient) { }
  getRegistrants(query?: string, id?: string): any {
    if (id) {
      return this.http.get(`${this.BASE_URL}/registrants?id=${id}`);
    }
    else if (query) {
      return this.http.get(`${this.BASE_URL}/registrants?q=${query}`);
    }
    else {
      return this.http.get(`${this.BASE_URL}/registrants`);
    }
  }
  getStats(stats) {
    if (stats){
      return this.http.get(`${this.BASE_URL}/stats?stats=${stats}`);
    }
    else {
      return this.http.get(`${this.BASE_URL}/stats`);
    }
  }
  checkInUser(uuid: string) {
    return this.http.get(`${this.BASE_URL}/registrants/${uuid}/checkin`);
  }
  checkOutUser(uuid: string) {
    return this.http.get(`${this.BASE_URL}/registrants/${uuid}/checkout`);
  }
  isUserMinor(dateOfBirth: string) {
    const date = new Date(dateOfBirth);
    const ageDifMs = new Date('2020-02-22').getTime() - date.getTime();
    const ageDate = new Date(ageDifMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    if (age > 17) {
      return false;
    } else {
      return true;
    }
  }
}
