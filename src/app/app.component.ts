/**
 * app.component.ts — Composant racine de l'application.
 *
 * Sert uniquement de coque pour le <router-outlet> : c'est Angular Router
 * qui injecte ici le composant correspondant à l'URL courante.
 * Toute la logique métier se trouve dans les composants de feature
 * (LoginFormComponent, DashboardComponent).
 */
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
