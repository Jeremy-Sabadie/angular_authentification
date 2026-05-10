import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface User {
  id: number;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/users`;

  // NOTE : json-server filtre par query params (GET). Une vraie API utiliserait POST avec le mot de passe dans le body.
  login(email: string, password: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}?email=${email}&password=${password}`);
  }
}
