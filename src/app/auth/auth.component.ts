import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  loginMode = true;
  loading = false;
  error: string = null;

  constructor(private authService: AuthService) {}

  onSwitchMode() {
    this.loginMode = !this.loginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value .password;
    this.loading = true;

    if (this.loginMode) {
      // ..
      this.loading = false;
    } else {
      this.authService.signup(email, password).subscribe(
        resData => {
          console.log(resData);
          this.loading = false;
        }, err => {
          this.error = 'An error occurred!';
          this.loading = false;
        }
      );
    }
    form.reset();
  }
}
