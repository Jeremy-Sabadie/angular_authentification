/**
 * login-form.component.ts — Composant de connexion.
 *
 * Gère le formulaire d'authentification (email + mot de passe)
 * et orchestre la navigation vers /dashboard en cas de succès.
 *
 * Flux de connexion :
 *   1. L'utilisateur soumet le formulaire.
 *   2. AuthServiceService interroge l'API (filtre sur email — voir le service).
 *   3. Succès : l'utilisateur est stocké dans localStorage, redirection /dashboard.
 *   4. Échec API  : alerte SweetAlert2 "Erreur serveur".
 *   5. Utilisateur inconnu : message d'erreur inline dans le formulaire.
 */
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';

import { AuthServiceService, User } from '../auth-service.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthServiceService);
  private router = inject(Router);

  loginForm: FormGroup;

  /** Vrai pendant l'appel HTTP — désactive le bouton de soumission pour éviter les doubles envois. */
  isLoading = false;

  /** Bascule la visibilité du champ mot de passe (type text ↔ password). */
  showPassword = false;

  /** Message d'erreur affiché sous le formulaire quand les identifiants sont incorrects. */
  loginError: string | null = null;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      // minLength(6) : contrainte reflétée dans le message d'erreur du template.
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  /** Raccourcis d'accès aux contrôles — utilisés dans le template pour afficher les erreurs. */
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  /**
   * Soumet le formulaire de connexion.
   * markAllAsTouched() force l'affichage des erreurs de validation
   * si l'utilisateur clique sur "Se connecter" sans remplir les champs.
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.loginError = null;

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (users: User[]) => {
        this.isLoading = false;

        if (users.length > 0) {
          // Persistance de session : stocke le premier utilisateur retourné.
          // authGuard lit cette clé pour protéger l'accès à /dashboard.
          localStorage.setItem('user', JSON.stringify(users[0]));

          Swal.fire({
            icon: 'success',
            title: 'Connexion réussie',
            text: 'Bienvenue',
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {
            this.router.navigate(['/dashboard']);
          });
        } else {
          // L'API a répondu 200 mais sans utilisateur correspondant à cet email.
          this.loginError = 'Email ou mot de passe incorrect';
        }
      },

      error: () => {
        this.isLoading = false;

        Swal.fire({
          icon: 'error',
          title: 'Erreur serveur',
          text: 'Impossible de contacter le serveur',
        });
      },
    });
  }

  /** Réinitialise le formulaire et masque le mot de passe. */
  onCancel(): void {
    this.loginForm.reset();
    this.showPassword = false;
  }
}
