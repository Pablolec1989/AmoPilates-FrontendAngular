import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';
import { CreateTurnoDTO, UpdateTurnoDTO, Instructor, Horario, Alumno, Turno } from '../../models/turno.model';

@Component({
  selector: 'app-crear-turno-dialog',
  templateUrl: './crear-turno-dialog.component.html',
  styleUrls: ['./crear-turno-dialog.component.scss']
})
export class CrearTurnoDialogComponent implements OnInit {
  turnoForm: FormGroup;
  loading = false;
  loadingDatos = true;
  
  instructores: Instructor[] = [];
  horarios: Horario[] = [];
  alumnos: Alumno[] = [];
  alumnosSeleccionados: number[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CrearTurnoDialogComponent>,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: {
      instructores: Instructor[];
      horarios: Horario[];
      alumnos: Alumno[];
      turno?: Turno;
      esEdicion?: boolean;
    }
  ) {
    this.instructores = data.instructores || [];
    this.horarios = data.horarios || [];
    this.alumnos = data.alumnos || [];
    
    this.turnoForm = this.fb.group({
      horarioId: ['', Validators.required],
      instructorId: ['', Validators.required],
      capacidad: [1, [Validators.required, Validators.min(1), Validators.max(20)]],
      alumnosIds: [[]]
    });

    // Si es edición, inicializar el formulario con los datos del turno
    if (data.esEdicion && data.turno) {
      this.turnoForm.patchValue({
        horarioId: data.turno.horario.id,
        instructorId: data.turno.instructor.id,
        capacidad: data.turno.capacidad,
        alumnosIds: data.turno.alumnos.map(a => a.id)
      });
      this.alumnosSeleccionados = data.turno.alumnos.map(a => a.id);
    }
  }

  ngOnInit(): void {
    // Ya no filtramos instructores ni horarios, mostramos todos los que vienen por data

    // Alumnos: activos + los asignados al turno (aunque estén inactivos)
    if (this.data.esEdicion && this.data.turno) {
      const alumnosAsignados = this.data.turno.alumnos;
      const alumnosActivos = this.alumnos.filter(a => a.activo);
      const alumnosUnicos = [...alumnosActivos];
      alumnosAsignados.forEach(asignado => {
        if (!alumnosUnicos.some(a => a.id === asignado.id)) {
          alumnosUnicos.push(asignado);
        }
      });
      this.alumnos = alumnosUnicos;
    } else {
      this.alumnos = this.alumnos.filter(a => a.activo);
    }

    // Cuando los datos están listos, ocultar el spinner
    this.loadingDatos = false;
  }

  async onSubmit(): Promise<void> {
    if (this.turnoForm.valid) {
      try {
        this.loading = true;
        if (this.data.esEdicion && this.data.turno) {
          // Modo edición
          const updateDto: UpdateTurnoDTO = {
            id: this.data.turno.id,
            horarioId: this.turnoForm.value.horarioId,
            instructorId: this.turnoForm.value.instructorId,
            capacidad: this.turnoForm.value.capacidad,
            alumnosIds: this.alumnosSeleccionados.length > 0 ? this.alumnosSeleccionados : []
          };
          await this.apiService.updateTurno(this.data.turno.id, updateDto).toPromise();
          this.snackBar.open('Turno actualizado correctamente', 'Cerrar', { 
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        } else {
          // Modo creación
          const turnoData: CreateTurnoDTO = {
            horarioId: this.turnoForm.value.horarioId,
            instructorId: this.turnoForm.value.instructorId,
            capacidad: this.turnoForm.value.capacidad,
            alumnosIds: this.alumnosSeleccionados.length > 0 ? this.alumnosSeleccionados : undefined
          };
          await this.apiService.createTurno(turnoData).toPromise();
          this.snackBar.open('Turno creado correctamente', 'Cerrar', { 
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        }
        this.dialogRef.close(true);
      } catch (error) {
        console.error('Error al guardar turno:', error);
        this.snackBar.open('Error al guardar el turno', 'Cerrar', { 
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      } finally {
        this.loading = false;
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  toggleAlumno(alumnoId: number): void {
    const index = this.alumnosSeleccionados.indexOf(alumnoId);
    if (index > -1) {
      this.alumnosSeleccionados.splice(index, 1);
    } else {
      // Verificar que no exceda la capacidad
      if (this.alumnosSeleccionados.length < this.turnoForm.value.capacidad) {
        this.alumnosSeleccionados.push(alumnoId);
      } else {
        this.snackBar.open('No puedes agregar más alumnos que la capacidad del turno', 'Cerrar', { 
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    }
  }

  isAlumnoSeleccionado(alumnoId: number): boolean {
    return this.alumnosSeleccionados.includes(alumnoId);
  }

  getNombreCompletoAlumno(alumno: Alumno): string {
    return `${alumno.nombre} ${alumno.apellido}`.trim();
  }

  getNombreCompletoInstructor(instructor: Instructor): string {
    return `${instructor.nombre} ${instructor.apellido}`.trim();
  }

  getHorarioCompleto(horario: Horario): string {
    return `${horario.diaNombre} - ${horario.hora}`;
  }
} 