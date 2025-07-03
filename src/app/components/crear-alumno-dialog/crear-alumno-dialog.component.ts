import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';
import { CreateAlumnoDTO } from '../../models/turno.model';

@Component({
  selector: 'app-crear-alumno-dialog',
  templateUrl: './crear-alumno-dialog.component.html',
  styleUrls: ['./crear-alumno-dialog.component.scss']
})
export class CrearAlumnoDialogComponent implements OnInit {
  alumnoForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CrearAlumnoDialogComponent>,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.alumnoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      telefono: ['', [Validators.pattern(/^[\d\s\-\+\(\)]+$/)]],
      observaciones: [''],
      cuotaPagada: [false],
      activo: [true]
    });
  }

  ngOnInit(): void {
  }

  async onSubmit(): Promise<void> {
    if (this.alumnoForm.valid) {
      try {
        this.loading = true;
        
        const alumnoData: CreateAlumnoDTO = {
          nombre: this.alumnoForm.value.nombre.trim(),
          apellido: this.alumnoForm.value.apellido.trim(),
          telefono: this.alumnoForm.value.telefono?.trim() || '',
          observaciones: this.alumnoForm.value.observaciones?.trim() || '',
          cuotaPagada: this.alumnoForm.value.cuotaPagada,
          activo: this.alumnoForm.value.activo,
          turnosIds: []
        };

        const nuevoAlumno = await this.apiService.createAlumno(alumnoData).toPromise();
        
        this.snackBar.open('Alumno creado correctamente', 'Cerrar', { duration: 3000 });
        this.dialogRef.close(nuevoAlumno);
      } catch (error) {
        console.error('Error al crear alumno:', error);
        this.snackBar.open('Error al crear el alumno', 'Cerrar', { duration: 3000 });
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