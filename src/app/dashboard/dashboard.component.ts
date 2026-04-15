import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  materiels: Materiel[] = [];

  form: FormGroup;

  showList = true;

  // gestion popup
  showModal = false;
  currentId: number | null = null;

  constructor(
    private service: MaterielsService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      serialNumber: ['', Validators.required],
      dateMiseEnService: ['', Validators.required],
      dateFinGarantie: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadMateriels();
  }

  toggleList() {
    this.showList = !this.showList;
  }

  loadMateriels() {
    this.service.getAll().subscribe((data) => {
      this.materiels = data;
    });
  }

  // OUVRIR MODAL
  openEditModal(m: Materiel) {
    this.currentId = m.id ?? null;
    this.form.patchValue(m);
    this.showModal = true;
  }

  // FERMER MODAL
  closeModal() {
    this.showModal = false;
    this.form.reset();
    this.currentId = null;
  }

  // UPDATE
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
            title: 'Modifié',
            timer: 1200,
            showConfirmButton: false,
          });
        });
      }
    });
  }

  // DELETE
  delete(id: number) {
    Swal.fire({
      title: 'Supprimer ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete(id).subscribe(() => {
          this.loadMateriels();
        });
      }
    });
  }
}
