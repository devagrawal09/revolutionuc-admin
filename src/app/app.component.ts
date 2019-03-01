import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private auth: AuthService) {}
  isLoggedIn = this.auth.isUserLoggedIn();
  logout() {
    this.auth.logout();
    location.reload();
  }
}
