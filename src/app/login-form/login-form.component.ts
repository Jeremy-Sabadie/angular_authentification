import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from '../auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent {
  // je déclare mon form de login
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private router: Router, // je l’utilise pour rediriger après login
  ) {
    // je construis mon formulaire
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
    // je vérifie que le form est valide
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService
        .getConnexionElements(email, password)
        .subscribe((response: any) => {
          // si user trouvé
          if (response && response.length > 0) {
            console.log('connexion réussie');

            // je stocke l'utilisateur en session (simulation auth)
            localStorage.setItem('user', JSON.stringify(response[0]));

            // redirection dashboard
            this.router.navigate(['/dashboard']);
          } else {
            console.log('identifiants incorrects');
          }
        });
    }
  }

  onCancel(): void {
    // reset form
    this.loginForm.reset();
  }
}
