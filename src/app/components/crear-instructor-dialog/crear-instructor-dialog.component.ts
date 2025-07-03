import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';
import { Instructor } from '../../models/turno.model';

@Component({
  selector: 'app-crear-instructor-dialog',
  templateUrl: './crear-instructor-dialog.component.html',
  styleUrls: ['./crear-instructor-dialog.component.scss']
})
export class CrearInstructorDialogComponent implements OnInit {
  instructorForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CrearInstructorDialogComponent>,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.instructorForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      telefono: ['', [Validators.required, Validators.pattern(/^[\d\s\-\+\(\)]+$/)]],
      porcentajePago: [70, [Validators.required, Validators.min(0), Validators.max(100)]],
      activo: [true]
    });
  }

  ngOnInit(): void {
  }

  async onSubmit(): Promise<void> {
    if (this.instructorForm.valid) {
      try {
        this.loading = true;
        
        const instructorData: Instructor = {
          id: 0, // Se asignará automáticamente en el backend
          nombre: this.instructorForm.value.nombre.trim(),
          apellido: this.instructorForm.value.apellido.trim(),
          telefono: this.instructorForm.value.telefono.trim(),
          porcentajePago: this.instructorForm.value.porcentajePago,
          activo: this.instructorForm.value.activo
        };

        const nuevoInstructor = await this.apiService.createInstructor(instructorData).toPromise();
        
        this.snackBar.open('Instructor creado correctamente', 'Cerrar', { duration: 3000 });
        this.dialogRef.close(nuevoInstructor);
      } catch (error) {
        console.error('Error al crear instructor:', error);
        this.snackBar.open('Error al crear el instructor', 'Cerrar', { duration: 3000 });
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