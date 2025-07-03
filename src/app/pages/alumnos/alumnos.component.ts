import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { Alumno, CreateAlumnoDTO, UpdateAlumnoDTO } from '../../models/turno.model';
import { CrearAlumnoDialogComponent } from '../../components/crear-alumno-dialog/crear-alumno-dialog.component';
import { EditarAlumnoDialogComponent } from '../../components/editar-alumno-dialog/editar-alumno-dialog.component';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.scss']
})
export class AlumnosComponent implements OnInit {
  displayedColumns: string[] = [
    'nombre', 'apellido', 'telefono', 'cuotaPagada', 'activo', 'acciones'
  ];
  dataSource = new MatTableDataSource<Alumno>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  alumnos: Alumno[] = [];
  loading = false;
  
  // Filtros
  filtroCuotaPagada = 0; // 0: Todos, 1: Sí, 2: No
  filtroActivo = 1; // 0: Todos, 1: Sí, 2: No
  filtroApellido = '';
  
  // Paginación
  paginaActual = 1;
  totalPaginas = 1;
  pageSize = 50;
  totalAlumnos = 0;

  private filtroApellidoSubject = new Subject<string>();

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { 
    // Configurar debounce para el filtro de apellido
    this.filtroApellidoSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.filtroApellido = value;
      this.aplicarFiltros();
    });
  }

  ngOnInit(): void {
    this.cargarAlumnosPaginados();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Configurar el paginador después de que esté disponible
    if (this.paginator) {
      this.paginator.length = this.totalAlumnos;
      this.paginator.pageIndex = 0;
      this.paginator.pageSize = this.pageSize;
    }
  }

  async cargarAlumnosPaginados(): Promise<void> {
    try {
      this.loading = true;
      
      // Determinar el filtro de estado activo
      let soloActivos: boolean | undefined;
      if (this.filtroActivo === 1) {
        soloActivos = true; // Solo activos
      } else if (this.filtroActivo === 2) {
        soloActivos = false; // Solo inactivos
      } else {
        soloActivos = undefined; // Todos
      }
      
      // Determinar el filtro de cuota pagada
      let cuotaPagada: boolean | undefined;
      if (this.filtroCuotaPagada === 1) {
        cuotaPagada = true; // Solo pagados
      } else if (this.filtroCuotaPagada === 2) {
        cuotaPagada = false; // Solo no pagados
      } else {
        cuotaPagada = undefined; // Todos
      }
      
      // Log de depuración para verificar los filtros
      console.log('Filtros aplicados:', {
        pagina: this.paginaActual,
        pageSize: this.pageSize,
        soloActivos,
        cuotaPagada,
        apellido: this.filtroApellido
      });
      
      const result = await this.apiService.getAlumnosPaginados(
        this.paginaActual, 
        this.pageSize, 
        soloActivos,
        cuotaPagada,
        this.filtroApellido
      ).toPromise();
      
      if (result) {
        this.alumnos = result.alumnos;
        this.totalAlumnos = result.total;
        this.paginaActual = result.page;
        this.pageSize = result.pageSize;
        this.totalPaginas = Math.ceil(this.totalAlumnos / this.pageSize);
        
        // Log de depuración para verificar los resultados
        console.log('Resultados obtenidos:', {
          total: this.totalAlumnos,
          alumnosEncontrados: this.alumnos.length,
          pagina: this.paginaActual
        });
        
        // Actualizar el dataSource directamente sin aplicar filtros locales
        this.dataSource.data = this.alumnos;
        
        // Sincronizar el paginador de Angular Material
        if (this.paginator) {
          this.paginator.length = this.totalAlumnos;
          this.paginator.pageIndex = this.paginaActual - 1;
          this.paginator.pageSize = this.pageSize;
        }
      }
    } catch (error) {
      console.error('Error al cargar alumnos:', error);
      this.snackBar.open('Error al cargar los alumnos', 'Cerrar', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  aplicarFiltros(): void {
    // Los filtros ahora se aplican a nivel de API, no localmente
    this.paginaActual = 1; // Resetear a la primera página
    this.cargarAlumnosPaginados();
  }

  async cambiarPagina(event: any): Promise<void> {
    this.paginaActual = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    await this.cargarAlumnosPaginados();
  }

  async cambiarPageSize(): Promise<void> {
    this.paginaActual = 1;
    await this.cargarAlumnosPaginados();
  }

  onFiltroChange(): void {
    this.aplicarFiltros();
  }

  crearAlumno(): void {
    const dialogRef = this.dialog.open(CrearAlumnoDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the result from the dialog
        this.snackBar.open('Alumno creado correctamente', 'Cerrar', { duration: 3000 });
        this.cargarAlumnosPaginados();
      }
    });
  }

  editarAlumno(alumno: Alumno): void {
    const dialogRef = this.dialog.open(EditarAlumnoDialogComponent, {
      data: { alumno: alumno }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the result from the dialog
        this.snackBar.open('Alumno actualizado correctamente', 'Cerrar', { duration: 3000 });
        this.cargarAlumnosPaginados();
      }
    });
  }

  async eliminarAlumno(alumno: Alumno): Promise<void> {
    if (confirm(`¿Estás seguro de que quieres eliminar a ${alumno.nombre} ${alumno.apellido}?`)) {
      try {
        await this.apiService.deleteAlumno(alumno.id).toPromise();
        this.snackBar.open('Alumno eliminado correctamente', 'Cerrar', { duration: 3000 });
        this.cargarAlumnosPaginados();
      } catch (error) {
        console.error('Error al eliminar alumno:', error);
        this.snackBar.open('Error al eliminar el alumno', 'Cerrar', { duration: 3000 });
      }
    }
  }

  async toggleActivo(alumno: Alumno): Promise<void> {
    try {
      const updateDto: UpdateAlumnoDTO = {
        id: alumno.id,
        nombre: alumno.nombre,
        apellido: alumno.apellido,
        telefono: alumno.telefono || '',
        observaciones: alumno.observaciones,
        cuotaPagada: alumno.cuotaPagada,
        activo: !alumno.activo,
        turnosIds: []
      };
      
      await this.apiService.updateAlumno(alumno.id, updateDto).toPromise();
      this.snackBar.open(`Alumno ${alumno.activo ? 'desactivado' : 'activado'} correctamente`, 'Cerrar', { duration: 3000 });
      this.cargarAlumnosPaginados();
    } catch (error) {
      console.error('Error al cambiar estado del alumno:', error);
      this.snackBar.open('Error al cambiar el estado del alumno', 'Cerrar', { duration: 3000 });
    }
  }

  async toggleCuotaPagada(alumno: Alumno): Promise<void> {
    try {
      const updateDto: UpdateAlumnoDTO = {
        id: alumno.id,
        nombre: alumno.nombre,
        apellido: alumno.apellido,
        telefono: alumno.telefono || '',
        observaciones: alumno.observaciones,
        cuotaPagada: !alumno.cuotaPagada,
        activo: alumno.activo,
        turnosIds: []
      };
      
      await this.apiService.updateAlumno(alumno.id, updateDto).toPromise();
      this.snackBar.open(`Cuota ${alumno.cuotaPagada ? 'marcada como no pagada' : 'marcada como pagada'} correctamente`, 'Cerrar', { duration: 3000 });
      this.cargarAlumnosPaginados();
    } catch (error) {
      console.error('Error al cambiar estado de cuota:', error);
      this.snackBar.open('Error al cambiar el estado de la cuota', 'Cerrar', { duration: 3000 });
    }
  }

  enviarWhatsApp(alumno: Alumno): void {
    if (!alumno.telefono) {
      this.snackBar.open('El alumno no tiene número de teléfono registrado', 'Cerrar', { duration: 3000 });
      return;
    }
    
    const telefono = this.normalizarTelefono(alumno.telefono);
    const mensaje = encodeURIComponent(`Hola ${alumno.nombre}, te recordamos tu clase de Pilates.`);
    const url = `https://wa.me/${telefono}?text=${mensaje}`;
    window.open(url, '_blank');
  }

  private normalizarTelefono(telefono: string): string {
    return telefono.replace(/\D/g, '');
  }

  async reiniciarCuotas(): Promise<void> {
    if (confirm('¿Estás seguro de que quieres reiniciar todas las cuotas de los alumnos?')) {
      try {
        await this.apiService.reiniciarCuotasAlumnos().toPromise();
        this.snackBar.open('Cuotas reiniciadas correctamente', 'Cerrar', { duration: 3000 });
        this.cargarAlumnosPaginados();
      } catch (error) {
        console.error('Error al reiniciar cuotas:', error);
        this.snackBar.open('Error al reiniciar las cuotas', 'Cerrar', { duration: 3000 });
      }
    }
  }

  actualizarAlumnos(): void {
    this.cargarAlumnosPaginados();
  }

  aplicarFiltro(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filtroApellido = filterValue;
    this.filtroApellidoSubject.next(filterValue);
  }

  ngOnDestroy(): void {
    this.filtroApellidoSubject.complete();
  }
} 