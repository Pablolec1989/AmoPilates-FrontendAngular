import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { Horario } from '../../models/turno.model';
import { EditarHorarioDialogComponent } from '../../components/editar-horario-dialog/editar-horario-dialog.component';
import { CrearHorarioDialogComponent } from '../../components/crear-horario-dialog/crear-horario-dialog.component';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.scss']
})
export class HorariosComponent implements OnInit {
  displayedColumns: string[] = [
    'dia', 'hora', 'acciones'
  ];
  dataSource = new MatTableDataSource<Horario>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  horarios: Horario[] = [];
  loading = false;
  
  // Filtros
  filtroDia = 0; // 0: Todos, 1-7: Días específicos
  filtroHora = '';

  // Días de la semana
  diasSemana = [
    { id: 0, nombre: 'Todos' },
    { id: 1, nombre: 'Lunes' },
    { id: 2, nombre: 'Martes' },
    { id: 3, nombre: 'Miércoles' },
    { id: 4, nombre: 'Jueves' },
    { id: 5, nombre: 'Viernes' },
    { id: 6, nombre: 'Sábado' },
    { id: 7, nombre: 'Domingo' }
  ];

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.cargarHorarios();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async cargarHorarios(): Promise<void> {
    try {
      this.loading = true;
      const horarios = await firstValueFrom(this.apiService.getHorarios());
      
      if (horarios) {
        this.horarios = horarios;
        this.aplicarFiltros();
      }
    } catch (error) {
      console.error('Error al cargar horarios:', error);
      this.snackBar.open('Error al cargar los horarios', 'Cerrar', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  aplicarFiltros(): void {
    const diaFiltro = this.filtroDia; // 0: Todos, 1-7: Días específicos
    const horaFiltro = this.filtroHora.trim().toLowerCase();

    const filtrados = this.horarios.filter(h =>
      (diaFiltro === 0 || h.dia === diaFiltro) &&
      (horaFiltro === '' || h.hora.toLowerCase().includes(horaFiltro))
    );

    this.dataSource.data = filtrados;
  }

  onFiltroChange(): void {
    this.aplicarFiltros();
  }

  crearHorario(): void {
    const dialogRef = this.dialog.open(CrearHorarioDialogComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Horario creado correctamente', 'Cerrar', { duration: 3000 });
        this.cargarHorarios();
      }
    });
  }

  editarHorario(horario: Horario): void {
    const dialogRef = this.dialog.open(EditarHorarioDialogComponent, {
      width: '400px',
      data: { horario }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Horario actualizado correctamente', 'Cerrar', { duration: 3000 });
        this.cargarHorarios();
      }
    });
  }

  async eliminarHorario(horario: Horario): Promise<void> {
    const diaNombre = this.getDiaNombre(horario.dia);
    if (confirm(`¿Estás seguro de que quieres eliminar el horario del ${diaNombre} a las ${horario.hora}?`)) {
      try {
        await firstValueFrom(this.apiService.deleteHorario(horario.id));
        this.snackBar.open('Horario eliminado correctamente', 'Cerrar', { duration: 3000 });
        this.cargarHorarios();
      } catch (error) {
        console.error('Error al eliminar horario:', error);
        this.snackBar.open('Error al eliminar el horario', 'Cerrar', { duration: 3000 });
      }
    }
  }

  getDiaNombre(dia: number): string {
    const diaObj = this.diasSemana.find(d => d.id === dia);
    return diaObj ? diaObj.nombre : 'Desconocido';
  }

  getDiaColor(dia: number): string {
    const colores = {
      1: '#ff6b6b', // Lunes - Rojo
      2: '#4ecdc4', // Martes - Turquesa
      3: '#45b7d1', // Miércoles - Azul
      4: '#96ceb4', // Jueves - Verde
      5: '#feca57', // Viernes - Amarillo
      6: '#ff9ff3', // Sábado - Rosa
      7: '#54a0ff'  // Domingo - Azul claro
    };
    return colores[dia as keyof typeof colores] || '#ccc';
  }

  actualizarHorarios(): void {
    this.cargarHorarios();
  }

  aplicarFiltro(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filtroHora = filterValue;
    this.aplicarFiltros();
  }
} 