import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private BASE_URL: string = environment.BASE_URL;
  private headers: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http: HttpClient) { }
  login(apiKey: string): void {
    localStorage.setItem('token', apiKey);
  }
  logout(): void {
    localStorage.removeItem('token');
  }
  getToken(): string {
    return localStorage.getItem('token');
  }
  isUserLoggedIn(): boolean {
    if (this.getToken()) {
      return true;
    }
    else {
      return false;
    }
  }
}
