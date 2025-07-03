import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-turnos-calendario',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './turnos-calendario.component.html',
  styleUrl: './turnos-calendario.component.scss'
})
export class TurnosCalendarioComponent implements OnInit {
  turnos: any[] = [];
  semanaActual: Date[] = [];
  horasDelDia: string[] = [];
  diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.inicializarSemana();
    this.cargarTurnos();
  }

  cargarTurnos(): void {
    this.apiService.getTurnos().subscribe(turnos => {
      this.turnos = turnos;
      this.horasDelDia = Array.from(new Set(this.turnos.map(t => t.horario.hora))).sort();
    });
  }

  actualizarTurnos(): void {
    this.cargarTurnos();
  }

  inicializarSemana(): void {
    const hoy = new Date();
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay()); // Domingo
    this.semanaActual = [];
    for (let i = 0; i < 7; i++) {
      const fecha = new Date(inicioSemana);
      fecha.setDate(inicioSemana.getDate() + i);
      this.semanaActual.push(fecha);
    }
  }

  getTurnosPorDiaYHora(dia: Date, hora: string): any[] {
    const diaSemana = dia.getDay() === 0 ? 7 : dia.getDay();
    return this.turnos.filter(turno => {
      const turnoDia = turno.horario.dia;
      const turnoHora = turno.horario.hora.padStart(5, '0');
      const horaNormalizada = hora.padStart(5, '0');
      return turnoDia === diaSemana && turnoHora === horaNormalizada;
    });
  }

  getDiaNombre(dia: Date): string {
    return this.diasSemana[dia.getDay()];
  }
} 