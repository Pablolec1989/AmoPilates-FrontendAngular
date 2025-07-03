import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Turno, Alumno, Instructor, Horario } from '../../models/turno.model';

export interface TurnoDetallesData {
  turno: Turno;
  instructores: Instructor[];
  horarios: Horario[];
  alumnos: Alumno[];
}

@Component({
  selector: 'app-turno-detalles-dialog',
  templateUrl: './turno-detalles-dialog.component.html',
  styleUrls: ['./turno-detalles-dialog.component.scss']
})
export class TurnoDetallesDialogComponent {
  turno: Turno;
  instructores: Instructor[];
  horarios: Horario[];
  alumnos: Alumno[];

  constructor(
    public dialogRef: MatDialogRef<TurnoDetallesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TurnoDetallesData
  ) {
    this.turno = data.turno;
    this.instructores = data.instructores;
    this.horarios = data.horarios;
    this.alumnos = data.alumnos;
  }

  getEstadoColor(): string {
    if (this.turno.cuposDisponibles === 0) return 'warn';
    if (this.turno.cuposDisponibles <= 2) return 'accent';
    return 'primary';
  }

  getEstadoIcon(): string {
    if (this.turno.cuposDisponibles === 0) return 'block';
    if (this.turno.cuposDisponibles <= 2) return 'warning';
    return 'check_circle';
  }

  getEstadoTexto(): string {
    if (this.turno.cuposDisponibles === 0) return 'Completo';
    if (this.turno.cuposDisponibles <= 2) return 'Casi lleno';
    return 'Disponible';
  }

  getOcupacionPorcentaje(): number {
    return ((this.turno.capacidad - this.turno.cuposDisponibles) / this.turno.capacidad) * 100;
  }

  getNombreCompleto(alumno: Alumno): string {
    return `${alumno.nombre} ${alumno.apellido}`;
  }

  getInstructorCompleto(): string {
    return `${this.turno.instructor.nombre} ${this.turno.instructor.apellido}`;
  }

  getAlumnosConCuotaPagada(): number {
    return this.turno.alumnos.filter(alumno => alumno.cuotaPagada).length;
  }

  getAlumnosSinCuotaPagada(): number {
    return this.turno.alumnos.filter(alumno => !alumno.cuotaPagada).length;
  }

  onCerrar(): void {
    this.dialogRef.close();
  }

  onEditar(): void {
    this.dialogRef.close({ accion: 'editar', turno: this.turno });
  }

  onEliminar(): void {
    this.dialogRef.close({ accion: 'eliminar', turno: this.turno });
  }
} 