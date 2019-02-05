import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService]
})
export class LoginComponent implements OnInit {
  apiKey: string;
  constructor(private auth: AuthService, private router: Router) { }
  ngOnInit() {
  }
  onLogin(): void {
    this.auth.login(this.apiKey);
    this.router.navigate(['/']);
  }

}
