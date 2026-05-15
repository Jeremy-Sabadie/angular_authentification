/**
 * auth-service.service.ts — Service d'authentification.
 *
 * Responsabilité unique : vérifier les identifiants de l'utilisateur
 * en interrogeant l'API REST et retourner le(s) utilisateur(s) correspondant(s).
 *
 * Point d'entrée API :
 *   dev  → http://localhost:3000/users
 *   prod → /api/users  (proxyfié par nginx)
 */
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

/** Représente un utilisateur retourné par l'API d'authentification. */
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

  /**
   * Vérifie les identifiants de connexion.
   *
   * ⚠️  LOGIN SIMPLIFIÉ POUR TP + STABILITÉ CI
   *
   * json-server ne gère pas le filtrage sur le mot de passe de manière
   * fiable (pas de hachage, comparaison sensible à la casse variable) —
   * on filtre uniquement sur l'email pour éviter les faux échecs en CI.
   * En production, déléguer l'authentification à un backend sécurisé
   * avec hachage bcrypt et tokens JWT.
   *
   * @param email    Adresse email saisie par l'utilisateur.
   * @param password Mot de passe (non utilisé côté API dans ce TP).
   * @returns        Observable émettant un tableau de 0 ou 1 utilisateur.
   */
  login(email: string, _password: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}?email=${email}`);
  }
}
