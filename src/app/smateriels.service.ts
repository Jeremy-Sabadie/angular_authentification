import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

export interface Materiel {
  id?: number;
  serialNumber: string;
  dateMiseEnService: string;
  dateFinGarantie: string;
}

@Injectable({
  providedIn: 'root',
})
export class MaterielsService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/materiels`;

  getAll() {
    return this.http.get<Materiel[]>(this.url);
  }

  create(m: Materiel) {
    return this.http.post<Materiel>(this.url, m);
  }

  update(id: number, m: Materiel) {
    return this.http.put(`${this.url}/${id}`, m);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
