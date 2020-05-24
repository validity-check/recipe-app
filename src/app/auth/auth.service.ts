import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expriesIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) { }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDOLXWh6agFK-yQqlPKQTRqCMRQn_TVFNo',
      {
        email,
        password,
        returnSecureToken: true
      }
    ).pipe(catchError (errorRes => {
      let errorMessage = 'An uknown error occured';
      if (!errorRes.error || !errorRes.error.error) {
        return throwError(errorMessage);
      }
      switch (errorRes.error.error.message) {
        case 'EMAIL_EXISTS':
          errorMessage = 'This email already exists';
      }

      return throwError(errorMessage);
    }));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDOLXWh6agFK-yQqlPKQTRqCMRQn_TVFNo',
      {
        email,
        password,
        returnSecureToken: true
      }
    );
  }
}
