import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  
  constructor() { }

  // Métodos para estadísticas rápidas (se pueden implementar más adelante)
  getTotalAlumnos(): number {
    // TODO: Implementar llamada a API
    return 0;
  }

  getTotalInstructores(): number {
    // TODO: Implementar llamada a API
    return 0;
  }

  getTotalTurnos(): number {
    // TODO: Implementar llamada a API
    return 0;
  }

  getTotalHorarios(): number {
    // TODO: Implementar llamada a API
    return 0;
  }
} 