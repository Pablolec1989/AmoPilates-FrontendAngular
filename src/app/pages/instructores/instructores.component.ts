import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';
import { Instructor } from '../../models/turno.model';
import { CrearInstructorDialogComponent } from '../../components/crear-instructor-dialog/crear-instructor-dialog.component';
import { EditarInstructorDialogComponent } from '../../components/editar-instructor-dialog/editar-instructor-dialog.component';

@Component({
  selector: 'app-instructores',
  templateUrl: './instructores.component.html',
  styleUrls: ['./instructores.component.scss']
})
export class InstructoresComponent implements OnInit {
  displayedColumns: string[] = [
    'nombre', 'apellido', 'telefono', 'porcentajePago', 'activo', 'acciones'
  ];
  dataSource = new MatTableDataSource<Instructor>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  instructores: Instructor[] = [];
  loading = false;
  
  // Filtros
  soloActivos = true;
  filtroApellido = '';

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.cargarInstructores();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async cargarInstructores(): Promise<void> {
    try {
      this.loading = true;
      const instructores = await this.apiService.getInstructores(this.soloActivos).toPromise();
      
      if (instructores) {
        this.instructores = instructores;
        this.aplicarFiltros();
      }
    } catch (error) {
      console.error('Error al cargar instructores:', error);
      this.snackBar.open('Error al cargar los instructores', 'Cerrar', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  aplicarFiltros(): void {
    const apellidoFiltro = this.filtroApellido.trim().toLowerCase();
    const filtrados = this.instructores.filter(i =>
      apellidoFiltro === '' || i.apellido.toLowerCase().includes(apellidoFiltro)
    );
    this.dataSource.data = filtrados;
  }

  onFiltroActivoChange(): void {
    this.cargarInstructores();
  }

  crearInstructor(): void {
    const dialogRef = this.dialog.open(CrearInstructorDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Instructor creado correctamente', 'Cerrar', { duration: 3000 });
        this.cargarInstructores();
      }
    });
  }

  editarInstructor(instructor: Instructor): void {
    const dialogRef = this.dialog.open(EditarInstructorDialogComponent, {
      data: { instructor: instructor }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Instructor actualizado correctamente', 'Cerrar', { duration: 3000 });
        this.cargarInstructores();
      }
    });
  }

  async eliminarInstructor(instructor: Instructor): Promise<void> {
    if (confirm(`¿Estás seguro de que quieres eliminar a ${instructor.nombre} ${instructor.apellido}?`)) {
      try {
        await this.apiService.deleteInstructor(instructor.id).toPromise();
        this.snackBar.open('Instructor eliminado correctamente', 'Cerrar', { duration: 3000 });
        this.cargarInstructores();
      } catch (error) {
        console.error('Error al eliminar instructor:', error);
        this.snackBar.open('Error al eliminar el instructor', 'Cerrar', { duration: 3000 });
      }
    }
  }

  async toggleActivo(instructor: Instructor): Promise<void> {
    try {
      const updateData = {
        id: instructor.id,
        nombre: instructor.nombre,
        apellido: instructor.apellido,
        telefono: instructor.telefono,
        porcentajePago: instructor.porcentajePago,
        activo: !instructor.activo
      };
      
      await this.apiService.updateInstructor(instructor.id, updateData).toPromise();
      this.snackBar.open(`Instructor ${instructor.activo ? 'desactivado' : 'activado'} correctamente`, 'Cerrar', { duration: 3000 });
      this.cargarInstructores();
    } catch (error) {
      console.error('Error al cambiar estado del instructor:', error);
      this.snackBar.open('Error al cambiar el estado del instructor', 'Cerrar', { duration: 3000 });
    }
  }

  enviarWhatsApp(instructor: Instructor): void {
    if (!instructor.telefono) {
      this.snackBar.open('El instructor no tiene número de teléfono registrado', 'Cerrar', { duration: 3000 });
      return;
    }
    
    const telefono = this.normalizarTelefono(instructor.telefono);
    const mensaje = encodeURIComponent(`Hola ${instructor.nombre}, tienes un mensaje importante sobre las clases de Pilates.`);
    const url = `https://wa.me/${telefono}?text=${mensaje}`;
    window.open(url, '_blank');
  }

  private normalizarTelefono(telefono: string): string {
    return telefono.replace(/\D/g, '');
  }

  actualizarInstructores(): void {
    this.cargarInstructores();
  }

  aplicarFiltro(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filtroApellido = filterValue;
    this.aplicarFiltros();
  }
} 