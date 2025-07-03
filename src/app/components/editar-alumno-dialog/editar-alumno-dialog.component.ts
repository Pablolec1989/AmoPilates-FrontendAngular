import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';
import { Alumno, UpdateAlumnoDTO } from '../../models/turno.model';

@Component({
  selector: 'app-editar-alumno-dialog',
  templateUrl: './editar-alumno-dialog.component.html',
  styleUrls: ['./editar-alumno-dialog.component.scss']
})
export class EditarAlumnoDialogComponent implements OnInit {
  alumnoForm: FormGroup;
  loading = false;
  alumnoOriginal: Alumno;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditarAlumnoDialogComponent>,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { alumno: Alumno }
  ) {
    this.alumnoOriginal = data.alumno;
    this.alumnoForm = this.fb.group({
      nombre: [this.alumnoOriginal.nombre, [Validators.required, Validators.minLength(2)]],
      apellido: [this.alumnoOriginal.apellido, [Validators.required, Validators.minLength(2)]],
      telefono: [this.alumnoOriginal.telefono || '', [Validators.pattern(/^[\d\s\-\+\(\)]+$/)]],
      observaciones: [this.alumnoOriginal.observaciones || ''],
      cuotaPagada: [this.alumnoOriginal.cuotaPagada],
      activo: [this.alumnoOriginal.activo]
    });
  }

  ngOnInit(): void {
  }

  async onSubmit(): Promise<void> {
    if (this.alumnoForm.valid) {
      try {
        this.loading = true;
        
        const alumnoData: UpdateAlumnoDTO = {
          id: this.alumnoOriginal.id,
          nombre: this.alumnoForm.value.nombre.trim(),
          apellido: this.alumnoForm.value.apellido.trim(),
          telefono: this.alumnoForm.value.telefono?.trim() || '',
          observaciones: this.alumnoForm.value.observaciones?.trim() || '',
          cuotaPagada: this.alumnoForm.value.cuotaPagada,
          activo: this.alumnoForm.value.activo,
          turnosIds: [] // Por ahora no manejamos turnos en la edición
        };

        await this.apiService.updateAlumno(this.alumnoOriginal.id, alumnoData).toPromise();
        
        this.snackBar.open('Alumno actualizado correctamente', 'Cerrar', { duration: 3000 });
        this.dialogRef.close(true);
      } catch (error) {
        console.error('Error al actualizar alumno:', error);
        this.snackBar.open('Error al actualizar el alumno', 'Cerrar', { duration: 3000 });
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
    Object.keys(this.alumnoForm.controls).forEach(key => {
      const control = this.alumnoForm.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.alumnoForm.get(controlName);
    
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
    
    return '';
  }
} 