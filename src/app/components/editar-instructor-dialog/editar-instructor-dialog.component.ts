import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';
import { Instructor } from '../../models/turno.model';

@Component({
  selector: 'app-editar-instructor-dialog',
  templateUrl: './editar-instructor-dialog.component.html',
  styleUrls: ['./editar-instructor-dialog.component.scss']
})
export class EditarInstructorDialogComponent implements OnInit {
  instructorForm: FormGroup;
  loading = false;
  instructorOriginal: Instructor;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditarInstructorDialogComponent>,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { instructor: Instructor }
  ) {
    this.instructorOriginal = data.instructor;
    this.instructorForm = this.fb.group({
      nombre: [this.instructorOriginal.nombre, [Validators.required, Validators.minLength(2)]],
      apellido: [this.instructorOriginal.apellido, [Validators.required, Validators.minLength(2)]],
      telefono: [this.instructorOriginal.telefono, [Validators.required, Validators.pattern(/^[\d\s\-\+\(\)]+$/)]],
      porcentajePago: [this.instructorOriginal.porcentajePago, [Validators.required, Validators.min(0), Validators.max(100)]],
      activo: [this.instructorOriginal.activo]
    });
  }

  ngOnInit(): void {
  }

  async onSubmit(): Promise<void> {
    if (this.instructorForm.valid) {
      try {
        this.loading = true;
        
        const instructorData = {
          id: this.instructorOriginal.id,
          nombre: this.instructorForm.value.nombre.trim(),
          apellido: this.instructorForm.value.apellido.trim(),
          telefono: this.instructorForm.value.telefono.trim(),
          porcentajePago: this.instructorForm.value.porcentajePago,
          activo: this.instructorForm.value.activo
        };

        await this.apiService.updateInstructor(this.instructorOriginal.id, instructorData).toPromise();
        
        this.snackBar.open('Instructor actualizado correctamente', 'Cerrar', { duration: 3000 });
        this.dialogRef.close(true);
      } catch (error) {
        console.error('Error al actualizar instructor:', error);
        this.snackBar.open('Error al actualizar el instructor', 'Cerrar', { duration: 3000 });
      } finally {
        this.loading = false;
      }
    } else {
      this.marcarCamposInvalidos();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private marcarCamposInvalidos(): void {
    Object.keys(this.instructorForm.controls).forEach(key => {
      const control = this.instructorForm.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.instructorForm.get(controlName);
    
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    
    if (control?.hasError('minlength')) {
      const requiredLength = control.getError('minlength').requiredLength;
      return `Mínimo ${requiredLength} caracteres`;
    }
    
    if (control?.hasError('pattern')) {
      return 'Formato de teléfono inválido';
    }
    
    if (control?.hasError('min')) {
      return 'El valor mínimo es 0';
    }
    
    if (control?.hasError('max')) {
      return 'El valor máximo es 100';
    }
    
    return '';
  }
} 