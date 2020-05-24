import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService, AuthResponseData } from './auth.service';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  loginMode = true;
  loading = false;
  error: string = null;

  constructor(private authService: AuthService) { }

  onSwitchMode() {
    this.loginMode = !this.loginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    this.loading = true;

    if (this.loginMode) {
      authObs = this.authService.login(email, password);
      this.loading = false;
    } else {
      authObs = this.authService.signup(email, password);
    }
    authObs.subscribe(
      resData => {
        console.log(resData);
        this.loading = false;
      }, errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.loading = false;
      }
    );
    form.reset();
  }
}
