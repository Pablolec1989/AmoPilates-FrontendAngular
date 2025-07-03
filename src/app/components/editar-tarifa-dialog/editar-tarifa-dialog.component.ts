import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Tarifa } from '../../models/turno.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-tarifa-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './editar-tarifa-dialog.component.html',
  styleUrl: './editar-tarifa-dialog.component.scss'
})
export class EditarTarifaDialogComponent {
  tarifaForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditarTarifaDialogComponent>,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: Tarifa
  ) {
    this.tarifaForm = this.fb.group({
      cantidadTurnos: [data.cantidadTurnos, [Validators.required, Validators.min(1)]],
      precio: [data.precio, [Validators.required, Validators.min(0)]]
    });
  }

  guardar(): void {
    if (this.tarifaForm.invalid) return;
    this.loading = true;
    this.error = null;
    this.apiService.updateTarifa(this.data.id, this.tarifaForm.value).subscribe({
      next: () => this.dialogRef.close(true),
      error: err => {
        this.error = 'Error al actualizar la tarifa';
        this.loading = false;
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
