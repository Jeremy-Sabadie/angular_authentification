import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent {
  loginForm: FormGroup;

  // évite double clic pendant requête
  isLoading = false;

  // permet d'afficher / masquer le mot de passe
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.authService.getConnexionElements(email, password).subscribe({
      next: (users: any) => {
        this.isLoading = false;

        if (users.length > 0) {
          localStorage.setItem('isLoggedIn', 'true');

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
          Swal.fire({
            icon: 'error',
            title: 'Connexion refusée',
            text: 'Email ou mot de passe incorrect',
          });
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

  onCancel(): void {
    this.loginForm.reset();
    this.showPassword = false;
  }
}
