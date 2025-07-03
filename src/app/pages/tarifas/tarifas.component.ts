import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { Tarifa } from '../../models/turno.model';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CrearTarifaDialogComponent } from '../../components/crear-tarifa-dialog/crear-tarifa-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { EditarTarifaDialogComponent } from '../../components/editar-tarifa-dialog/editar-tarifa-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tarifas',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatDialogModule, CrearTarifaDialogComponent, EditarTarifaDialogComponent, MatIconModule],
  templateUrl: './tarifas.component.html',
  styleUrl: './tarifas.component.scss'
})
export class TarifasComponent implements OnInit {
  tarifas: Tarifa[] = [];
  displayedColumns: string[] = ['cantidadTurnos', 'precio', 'acciones'];

  constructor(private apiService: ApiService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.apiService.getTarifas().subscribe({
      next: tarifas => this.tarifas = tarifas,
      error: err => console.error('Error al obtener tarifas', err)
    });
  }

  abrirCrearTarifa(): void {
    const dialogRef = this.dialog.open(CrearTarifaDialogComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.getTarifas().subscribe({
          next: tarifas => this.tarifas = tarifas
        });
      }
    });
  }

  editarTarifa(tarifa: Tarifa): void {
    const dialogRef = this.dialog.open(EditarTarifaDialogComponent, {
      width: '400px',
      data: tarifa
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.getTarifas().subscribe({
          next: tarifas => this.tarifas = tarifas
        });
      }
    });
  }

  eliminarTarifa(tarifa: Tarifa): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarifa?')) {
      this.apiService.deleteTarifa(tarifa.id).subscribe({
        next: () => {
          this.snackBar.open('Tarifa eliminada correctamente', 'Cerrar', { duration: 2000 });
          this.apiService.getTarifas().subscribe({
            next: tarifas => this.tarifas = tarifas
          });
        },
        error: () => {
          this.snackBar.open('Error al eliminar la tarifa', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}
