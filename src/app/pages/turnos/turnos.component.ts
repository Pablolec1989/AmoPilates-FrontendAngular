import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { Turno, CreateTurnoDTO, UpdateTurnoDTO, Alumno, Instructor, Horario } from '../../models/turno.model';
import { CrearTurnoDialogComponent } from '../../components/crear-turno-dialog/crear-turno-dialog.component';
import { TurnoDetallesDialogComponent } from '../../components/turno-detalles-dialog/turno-detalles-dialog.component';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.scss']
})
export class TurnosComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'horario', 'instructor', 'capacidad', 'cuposDisponibles', 'alumnos', 'estado', 'acciones'
  ];
  dataSource = new MatTableDataSource<Turno>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  turnos: Turno[] = [];
  loading = false;
  
  // Datos para los diálogos
  instructores: Instructor[] = [];
  horarios: Horario[] = [];
  alumnos: Alumno[] = [];
  
  // Vista de calendario
  semanaActual: Date[] = [];
  diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  horasDelDia: string[] = [];
  
  // Filtros avanzados
  filtroInstructor = 0;
  filtroHorario = 0;
  filtroCupos = 0; // 0: Todos, 1: Con cupos, 2: Completos, 3: Vacíos
  mostrarConflictos = false;
  mostrarSoloHoy = false;
  vistaCalendario = true; // Por defecto mostrar calendario

  private destroy$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.inicializarSemana();
    this.cargarDatosIniciales();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private async cargarDatosIniciales(): Promise<void> {
    try {
      this.loading = true;
      
      // Cargar datos en paralelo
      const [turnos, instructores, horarios, alumnosPaginados] = await Promise.all([
        this.apiService.getTurnos().toPromise(),
        this.apiService.getInstructores().toPromise(),
        this.apiService.getHorarios().toPromise(),
        this.apiService.getAlumnosPaginados(1, 500, true).toPromise()
      ]);

      this.turnos = turnos || [];
      this.instructores = instructores || [];
      this.horarios = horarios || [];
      this.alumnos = (alumnosPaginados && alumnosPaginados.alumnos) ? alumnosPaginados.alumnos : [];
      
      // Calcular horarios únicos presentes en los turnos
      const horasSet = new Set<string>();
      this.turnos.forEach(t => {
        if (t.horario && t.horario.hora) {
          horasSet.add(t.horario.hora);
        }
      });
      this.horasDelDia = Array.from(horasSet).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
      
      // Debug temporal
      console.log('=== DEBUG CARGA DE DATOS ===');
      console.log('Turnos cargados:', this.turnos.length);
      console.log('Instructores cargados:', this.instructores.length);
      console.log('Horarios cargados:', this.horarios.length);
      console.log('Alumnos cargados:', this.alumnos.length);
      
      if (this.turnos.length > 0) {
        console.log('Primer turno:', this.turnos[0]);
        console.log('Alumnos en primer turno:', this.turnos[0].alumnos);
      }
      console.log('=== FIN DEBUG ===');
      
      this.aplicarFiltrosTurnos();
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
      this.mostrarError('Error al cargar los datos. Por favor, intenta de nuevo.');
    } finally {
      this.loading = false;
    }
  }

  async cargarTurnos(): Promise<void> {
    try {
      this.loading = true;
      const turnos = await this.apiService.getTurnos().toPromise();
      
      if (turnos) {
        this.turnos = turnos;
        this.aplicarFiltrosTurnos();
      }
    } catch (error) {
      console.error('Error al cargar turnos:', error);
      this.snackBar.open('Error al cargar los turnos', 'Cerrar', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  // Métodos de estadísticas
  getTotalTurnos(): number {
    return this.turnos.length;
  }

  getTotalAlumnos(): number {
    return this.turnos.reduce((total, turno) => total + turno.alumnos.length, 0);
  }

  getTurnosCompletos(): number {
    return this.turnos.filter(t => t.cuposDisponibles === 0).length;
  }

  getOcupacionPromedio(): number {
    if (this.turnos.length === 0) return 0;
    const ocupacionTotal = this.turnos.reduce((total, turno) => {
      return total + ((turno.capacidad - turno.cuposDisponibles) / turno.capacidad * 100);
    }, 0);
    return Math.round(ocupacionTotal / this.turnos.length);
  }

  // Métodos de estado
  getEstadoColor(turno: Turno): string {
    if (turno.cuposDisponibles === 0) return 'warn';
    if (turno.cuposDisponibles <= 2) return 'accent';
    return 'primary';
  }

  getEstadoIcon(turno: Turno): string {
    if (turno.cuposDisponibles === 0) return 'block';
    if (turno.cuposDisponibles <= 2) return 'warning';
    return 'check_circle';
  }

  getEstadoTexto(turno: Turno): string {
    if (turno.cuposDisponibles === 0) return 'Completo';
    if (turno.cuposDisponibles <= 2) return 'Casi lleno';
    return 'Disponible';
  }

  // Métodos de ocupación
  getOcupacionPorcentaje(turno: Turno): number {
    return ((turno.capacidad - turno.cuposDisponibles) / turno.capacidad) * 100;
  }

  // Métodos de conflictos
  tieneConflictos(turno: Turno): boolean {
    // Verificar si hay conflictos de horarios para el mismo instructor
    const conflictos = this.turnos.filter(t => 
      t.id !== turno.id && 
      t.instructor.id === turno.instructor.id &&
      t.horario.diaNombre === turno.horario.diaNombre &&
      t.horario.hora === turno.horario.hora
    );
    return conflictos.length > 0;
  }

  // Métodos de exportación
  exportarDatos(): void {
    try {
      const datos = this.turnos.map(turno => ({
        'Día': turno.horario.diaNombre,
        'Hora': turno.horario.hora,
        'Instructor': `${turno.instructor.nombre} ${turno.instructor.apellido}`,
        'Capacidad': turno.capacidad,
        'Cupos Disponibles': turno.cuposDisponibles,
        'Alumnos': turno.alumnos.map(a => `${a.nombre} ${a.apellido}`).join(', '),
        'Estado': this.getEstadoTexto(turno)
      }));

      const csvContent = this.convertirACSV(datos);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `turnos_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.mostrarExito('Datos exportados correctamente');
    } catch (error) {
      console.error('Error al exportar datos:', error);
      this.mostrarError('Error al exportar los datos');
    }
  }

  private convertirACSV(datos: any[]): string {
    if (datos.length === 0) return '';
    
    const headers = Object.keys(datos[0]);
    const csvRows = [
      headers.join(','),
      ...datos.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ];
    
    return csvRows.join('\n');
  }

  // Métodos de navegación del calendario
  getSemanaDisplay(): string {
    if (this.semanaActual.length === 0) return '';
    const inicio = this.semanaActual[0];
    const fin = this.semanaActual[6];
    return `${inicio.getDate()}/${inicio.getMonth() + 1} - ${fin.getDate()}/${fin.getMonth() + 1} ${fin.getFullYear()}`;
  }

  navegarSemana(direccion: 'anterior' | 'siguiente'): void {
    const offset = direccion === 'anterior' ? -7 : 7;
    this.semanaActual = this.semanaActual.map(dia => {
      const nuevaFecha = new Date(dia);
      nuevaFecha.setDate(nuevaFecha.getDate() + offset);
      return nuevaFecha;
    });
  }

  irAHoy(): void {
    this.inicializarSemana();
  }

  inicializarSemana(): void {
    const hoy = new Date();
    const diaSemana = hoy.getDay();
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - diaSemana);
    
    this.semanaActual = [];
    for (let i = 0; i < 7; i++) {
      const dia = new Date(inicioSemana);
      dia.setDate(inicioSemana.getDate() + i);
      this.semanaActual.push(dia);
    }
  }

  // Métodos del calendario
  getTurnosPorDiaYHora(dia: Date, hora: string): Turno[] {
    const diaNombre = this.getDiaNombre(dia);
    return this.turnos.filter(turno => 
      turno.horario.diaNombre === diaNombre && 
      turno.horario.hora === hora
    );
  }

  getTurnosPorDia(dia: Date): Turno[] {
    const diaNombre = this.getDiaNombre(dia);
    return this.turnos.filter(turno => turno.horario.diaNombre === diaNombre);
  }

  getDiaNombre(dia: Date): string {
    return this.diasSemana[dia.getDay()];
  }

  getDiaColor(dia: Date): string {
    if (this.esHoy(dia)) return '#1976d2';
    return '#666';
  }

  esHoy(dia: Date): boolean {
    const hoy = new Date();
    return dia.getDate() === hoy.getDate() && 
           dia.getMonth() === hoy.getMonth() && 
           dia.getFullYear() === hoy.getFullYear();
  }

  getTurnoTooltip(turno: Turno): string {
    const conflictos = this.tieneConflictos(turno);
    let tooltip = `${turno.instructor.nombre} ${turno.instructor.apellido}\n`;
    tooltip += `Cupos: ${turno.cuposDisponibles}/${turno.capacidad}\n`;
    tooltip += `Alumnos: ${turno.alumnos.length}`;
    
    if (turno.alumnos.length > 0) {
      tooltip += '\n\nAlumnos inscritos:';
      turno.alumnos.forEach((alumno, index) => {
        tooltip += `\n${index + 1}. ${this.getNombreCompleto(alumno)}`;
        if (alumno.telefono) {
          tooltip += ` (${alumno.telefono})`;
        }
        tooltip += alumno.cuotaPagada ? ' ✅' : ' ⚠️';
      });
    }
    
    if (conflictos) {
      tooltip += '\n\n⚠️ Conflicto de horario detectado';
    }
    
    return tooltip;
  }

  // Métodos de filtros
  onFiltroChange(): void {
    this.aplicarFiltrosTurnos();
  }

  onFiltroCuposChange(): void {
    this.aplicarFiltrosTurnos();
  }

  aplicarFiltrosTurnos(): void {
    let turnosFiltrados = [...this.turnos];

    // Filtro por instructor
    if (this.filtroInstructor > 0) {
      turnosFiltrados = turnosFiltrados.filter(t => t.instructor.id === this.filtroInstructor);
    }

    // Filtro por horario
    if (this.filtroHorario > 0) {
      turnosFiltrados = turnosFiltrados.filter(t => t.horario.id === this.filtroHorario);
    }

    // Filtro por cupos
    switch (this.filtroCupos) {
      case 1: // Con cupos disponibles
        turnosFiltrados = turnosFiltrados.filter(t => t.cuposDisponibles > 0);
        break;
      case 2: // Completos
        turnosFiltrados = turnosFiltrados.filter(t => t.cuposDisponibles === 0);
        break;
      case 3: // Vacíos
        turnosFiltrados = turnosFiltrados.filter(t => t.alumnos.length === 0);
        break;
    }

    // Filtro por conflictos
    if (this.mostrarConflictos) {
      turnosFiltrados = turnosFiltrados.filter(t => this.tieneConflictos(t));
    }

    // Filtro por solo hoy
    if (this.mostrarSoloHoy) {
      const hoy = new Date();
      const diaHoy = this.getDiaNombre(hoy);
      turnosFiltrados = turnosFiltrados.filter(t => t.horario.diaNombre === diaHoy);
    }

    this.dataSource.data = turnosFiltrados;
  }

  // Métodos de acciones
  crearTurno(): void {
    const dialogRef = this.dialog.open(CrearTurnoDialogComponent, {
      width: '700px',
      maxHeight: '90vh',
      data: {
        instructores: this.instructores,
        horarios: this.horarios,
        alumnos: this.alumnos
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarTurnos();
        this.mostrarExito('Turno creado correctamente');
      }
    });
  }

  async editarTurno(turno: Turno): Promise<void> {
    const dialogRef = this.dialog.open(CrearTurnoDialogComponent, {
      width: '700px',
      maxHeight: '90vh',
      data: {
        turno: turno,
        instructores: this.instructores,
        horarios: this.horarios,
        alumnos: this.alumnos,
        esEdicion: true
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarTurnos();
        this.mostrarExito('Turno actualizado correctamente');
      }
    });
  }

  verDetalles(turno: Turno): void {
    const dialogRef = this.dialog.open(TurnoDetallesDialogComponent, {
      width: '700px',
      maxHeight: '90vh',
      data: {
        turno: turno,
        instructores: this.instructores,
        horarios: this.horarios,
        alumnos: this.alumnos
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.accion === 'editar') {
          this.editarTurno(result.turno);
        } else if (result.accion === 'eliminar') {
          this.eliminarTurno(result.turno);
        }
      }
    });
  }

  async eliminarTurno(turno: Turno): Promise<void> {
    const confirmacion = confirm(`¿Estás seguro de que quieres eliminar el turno de ${turno.horario.diaNombre} ${turno.horario.hora} con ${turno.instructor.nombre}?`);
    
    if (confirmacion) {
      try {
        await this.apiService.deleteTurno(turno.id).toPromise();
        this.cargarTurnos();
        this.mostrarExito('Turno eliminado correctamente');
      } catch (error) {
        console.error('Error al eliminar turno:', error);
        this.mostrarError('Error al eliminar el turno');
      }
    }
  }

  actualizarTurnos(): void {
    this.cargarTurnos();
  }

  // Métodos de utilidad
  getNombreCompleto(alumno: Alumno): string {
    return `${alumno.nombre} ${alumno.apellido}`;
  }

  private mostrarExito(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private mostrarError(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  toggleVistaCalendario(): void {
    this.vistaCalendario = !this.vistaCalendario;
  }

  getTurnoPorDiaYHora(dia: string, hora: string) {
    return this.turnos.find(t => t.horario.diaNombre === dia && t.horario.hora === hora);
  }
}
