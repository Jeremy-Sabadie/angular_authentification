/**
 * dashboard.component.ts — Tableau de bord de gestion des matériels.
 *
 * Composant principal de l'application (route protégée /dashboard).
 * Implémente le CRUD complet sur la ressource Matériel via MaterielsService.
 *
 * Gestion d'état UI :
 *   showList  : affiche/masque le tableau des matériels (bouton bascule)
 *   showModal : ouvre/ferme la modale de modification
 *   currentId : ID du matériel en cours d'édition (null = pas d'édition en cours)
 *
 * Le formulaire `form` est partagé entre la création (inline) et la
 * modification (modale) : patchValue() le pré-remplit pour l'édition,
 * reset() le vide après soumission ou annulation.
 *
 * Toutes les actions destructives (modification, suppression) demandent
 * une confirmation via SweetAlert2 avant d'appeler l'API.
 */
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MaterielsService, Materiel } from '../smateriels.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  private service = inject(MaterielsService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  /** Liste des matériels chargés depuis l'API, affichée dans le tableau. */
  materiels: Materiel[] = [];

  /** Formulaire partagé entre la création (carte principale) et la modification (modale). */
  form: FormGroup;

  /** Contrôle la visibilité du tableau via le bouton bascule de la topbar. */
  showList = true;

  /** Vrai quand la modale de modification est ouverte. */
  showModal = false;

  /** ID du matériel en cours d'édition. Null quand aucune édition n'est en cours. */
  currentId: number | null = null;

  /** Données de l'utilisateur connecté, lues depuis le localStorage au démarrage. */
  currentUser: { email: string } | null = null;

  constructor() {
    const stored = localStorage.getItem('user');
    if (stored) {
      this.currentUser = JSON.parse(stored);
    }
    this.form = this.fb.group({
      serialNumber: ['', Validators.required],
      dateMiseEnService: ['', Validators.required],
      dateFinGarantie: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadMateriels();
  }

  // ─────────────────────────────────────────────
  // LISTE
  // ─────────────────────────────────────────────

  /** Bascule l'affichage du tableau des matériels. */
  toggleList() {
    this.showList = !this.showList;
  }

  /** Charge (ou recharge) la liste complète depuis l'API. */
  loadMateriels() {
    this.service.getAll().subscribe((data) => {
      this.materiels = data;
    });
  }

  // ─────────────────────────────────────────────
  // CRÉATION
  // ─────────────────────────────────────────────

  /** Soumet le formulaire de création et recharge la liste en cas de succès. */
  submitCreate() {
    if (this.form.invalid) return;

    this.service.create(this.form.value).subscribe(() => {
      this.loadMateriels();
      this.form.reset();

      Swal.fire({
        icon: 'success',
        title: 'Matériel ajouté',
        timer: 1200,
        showConfirmButton: false,
      });
    });
  }

  // ─────────────────────────────────────────────
  // MODIFICATION (modale)
  // ─────────────────────────────────────────────

  /**
   * Pré-remplit le formulaire avec les données du matériel sélectionné
   * et ouvre la modale d'édition.
   */
  openEditModal(m: Materiel) {
    this.currentId = m.id ?? null;
    this.form.patchValue(m);
    this.showModal = true;
  }

  /** Ferme la modale et remet le formulaire et currentId à leur état initial. */
  closeModal() {
    this.showModal = false;
    this.form.reset();
    this.currentId = null;
  }

  /** Demande confirmation puis envoie la modification à l'API. */
  submitEdit() {
    if (this.form.invalid || this.currentId === null) return;

    Swal.fire({
      title: 'Modifier ce matériel ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.update(this.currentId!, this.form.value).subscribe(() => {
          this.loadMateriels();
          this.closeModal();

          Swal.fire({
            icon: 'success',
            title: 'Matériel modifié',
            timer: 1200,
            showConfirmButton: false,
          });
        });
      }
    });
  }

  // ─────────────────────────────────────────────
  // SUPPRESSION
  // ─────────────────────────────────────────────

  /** Demande confirmation puis supprime définitivement le matériel identifié par `id`. */
  delete(id: number) {
    Swal.fire({
      title: 'Supprimer ce matériel ?',
      text: 'Cette action est irréversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete(id).subscribe(() => {
          this.loadMateriels();

          Swal.fire({
            icon: 'success',
            title: 'Supprimé',
            timer: 1200,
            showConfirmButton: false,
          });
        });
      }
    });
  }

  // ─────────────────────────────────────────────
  // AUTHENTIFICATION
  // ─────────────────────────────────────────────

  /** Déconnecte l'utilisateur en supprimant la session du localStorage et redirige vers /login. */
  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
