import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-crear-tarifa-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './crear-tarifa-dialog.component.html',
  styleUrl: './crear-tarifa-dialog.component.scss'
})
export class CrearTarifaDialogComponent {
  tarifaForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CrearTarifaDialogComponent>,
    private apiService: ApiService
  ) {
    this.tarifaForm = this.fb.group({
      cantidadTurnos: [null, [Validators.required, Validators.min(1)]],
      precio: [null, [Validators.required, Validators.min(0)]]
    });
  }

  guardar(): void {
    if (this.tarifaForm.invalid) return;
    this.loading = true;
    this.error = null;
    this.apiService.createTarifa(this.tarifaForm.value).subscribe({
      next: () => this.dialogRef.close(true),
      error: err => {
        this.error = 'Error al crear la tarifa';
        this.loading = false;
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
