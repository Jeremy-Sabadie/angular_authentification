/**
 * smateriels.service.ts — Service CRUD pour la ressource "Matériel".
 *
 * Communique avec l'API REST via l'URL configurée dans environment.ts.
 *
 * Point d'entrée API :
 *   dev  → http://localhost:3000/materiels
 *   prod → /api/materiels  (proxyfié par nginx vers le backend réel)
 *
 * Toutes les méthodes retournent des Observables : l'appelant (composant)
 * doit s'abonner (.subscribe()) pour déclencher l'appel HTTP.
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

/** Représente un équipement inventorié dans le système. */
export interface Materiel {
  /** Identifiant généré par le serveur — absent lors d'une création. */
  id?: number;
  /** Numéro de série unique de l'équipement. */
  serialNumber: string;
  /** Date de première mise en service (format ISO 8601 : YYYY-MM-DD). */
  dateMiseEnService: string;
  /** Date d'expiration de la garantie constructeur (format ISO 8601 : YYYY-MM-DD). */
  dateFinGarantie: string;
}

@Injectable({
  providedIn: 'root',
})
export class MaterielsService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/materiels`;

  /** Récupère la liste complète des matériels depuis l'API. */
  getAll() {
    return this.http.get<Materiel[]>(this.url);
  }

  /** Crée un nouveau matériel. L'`id` est assigné par le serveur. */
  create(m: Materiel) {
    return this.http.post<Materiel>(this.url, m);
  }

  /**
   * Remplace intégralement le matériel identifié par `id` (HTTP PUT).
   * Utiliser PUT (et non PATCH) car le formulaire envoie toujours
   * tous les champs de la ressource.
   */
  update(id: number, m: Materiel) {
    return this.http.put(`${this.url}/${id}`, m);
  }

  /** Supprime définitivement le matériel identifié par `id`. */
  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
