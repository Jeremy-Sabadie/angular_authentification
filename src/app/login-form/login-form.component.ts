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
  isLoading = false;
  showPassword = false;
  loginError: string | null = null;

  constructor() {
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
    this.loginError = null;

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (users: User[]) => {
        this.isLoading = false;

        if (users.length > 0) {
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

  onCancel(): void {
    this.loginForm.reset();
    this.showPassword = false;
  }
}
