import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { Horario } from '../../models/turno.model';

@Component({
  selector: 'app-crear-horario-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './crear-horario-dialog.component.html',
  styleUrl: './crear-horario-dialog.component.scss'
})
export class CrearHorarioDialogComponent implements OnInit {
  horarioForm: FormGroup;
  loading = false;

  // Días de la semana
  diasSemana = [
    { id: 1, nombre: 'Lunes' },
    { id: 2, nombre: 'Martes' },
    { id: 3, nombre: 'Miércoles' },
    { id: 4, nombre: 'Jueves' },
    { id: 5, nombre: 'Viernes' },
    { id: 6, nombre: 'Sábado' },
    { id: 7, nombre: 'Domingo' }
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private dialogRef: MatDialogRef<CrearHorarioDialogComponent>,
    private snackBar: MatSnackBar
  ) {
    this.horarioForm = this.fb.group({
      dia: ['', Validators.required],
      hora: ['', [Validators.required, Validators.pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)]]
    });
  }

  ngOnInit(): void {
    // El formulario se inicializa vacío para crear un nuevo horario
  }

  async onSubmit(): Promise<void> {
    if (this.horarioForm.valid) {
      try {
        this.loading = true;
        
        const horarioData: Omit<Horario, 'id'> = {
          dia: this.horarioForm.value.dia,
          hora: this.horarioForm.value.hora,
          diaNombre: this.getDiaNombre(this.horarioForm.value.dia)
        };

        await firstValueFrom(this.apiService.createHorario(horarioData as Horario));
        
        this.snackBar.open('Horario creado correctamente', 'Cerrar', { duration: 3000 });
        this.dialogRef.close(true);
      } catch (error) {
        console.error('Error al crear horario:', error);
        this.snackBar.open('Error al crear el horario', 'Cerrar', { duration: 3000 });
      } finally {
        this.loading = false;
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  getDiaNombre(dia: number): string {
    const diaObj = this.diasSemana.find(d => d.id === dia);
    return diaObj ? diaObj.nombre : 'Desconocido';
  }
} 