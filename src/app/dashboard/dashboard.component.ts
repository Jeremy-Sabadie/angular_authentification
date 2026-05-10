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

  materiels: Materiel[] = [];
  form: FormGroup;
  showList = true;
  showModal = false;
  currentId: number | null = null;
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

  // =========================
  // LIST
  // =========================
  toggleList() {
    this.showList = !this.showList;
  }

  loadMateriels() {
    this.service.getAll().subscribe((data) => {
      this.materiels = data;
    });
  }

  // =========================
  // CREATE
  // =========================
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

  // =========================
  // EDIT (MODAL)
  // =========================
  openEditModal(m: Materiel) {
    this.currentId = m.id ?? null;
    this.form.patchValue(m);
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.form.reset();
    this.currentId = null;
  }

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

  // =========================
  // DELETE
  // =========================
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

  // =========================
  // AUTH
  // =========================
  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
