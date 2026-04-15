import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private http = inject(HttpClient);
  private url = 'http://localhost:3000/users';

  getConnexionElements(email: string, password: string) {
    return this.http.get(`${this.url}?email=${email}&password=${password}`);
  }
}
