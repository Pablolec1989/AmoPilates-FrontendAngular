import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatIconModule],
  templateUrl: './pagos.component.html',
  styleUrl: './pagos.component.scss'
})
export class PagosComponent implements OnInit {
  displayedColumns: string[] = ['nombreCompleto', 'porcentajePago', 'pago'];
  pagos: any[] = [];
  gananciaTotal: number = 0;
  gananciaTotalInstructores: number = 0;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getGananciasPorInstructor().subscribe({
      next: data => {
        // Detecta si la respuesta es mayúscula o minúscula
        const lista = data.GananciasPorInstructor || data.gananciasPorInstructor || [];
        this.pagos = lista.map((p: any) => ({
          nombreCompleto: p.Nombre || p.nombre,
          porcentajePago: p.PorcentajePago || p.porcentajePago,
          pago: p.GananciaInstructor || p.gananciaInstructor
        }));
        this.gananciaTotalInstructores = data.ResumenGeneral?.GananciaTotalInstructores
          || data.resumenGeneral?.gananciaTotalInstructores
          || 0;
        this.gananciaTotal = data.ResumenGeneral?.GananciaTotalSistema
          || data.resumenGeneral?.gananciaTotalSistema
          || 0;
      },
      error: err => console.error('Error al obtener pagos por instructor', err)
    });
  }
} 