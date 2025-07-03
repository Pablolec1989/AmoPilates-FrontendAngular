import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';

// Components
import { AppComponent } from './app.component';
import { TurnosComponent } from './pages/turnos/turnos.component';
import { AlumnosComponent } from './pages/alumnos/alumnos.component';
import { InstructoresComponent } from './pages/instructores/instructores.component';
import { HorariosComponent } from './pages/horarios/horarios.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { CrearTurnoDialogComponent } from './components/crear-turno-dialog/crear-turno-dialog.component';
import { TurnoDetallesDialogComponent } from './components/turno-detalles-dialog/turno-detalles-dialog.component';
import { CrearAlumnoDialogComponent } from './components/crear-alumno-dialog/crear-alumno-dialog.component';
import { CrearInstructorDialogComponent } from './components/crear-instructor-dialog/crear-instructor-dialog.component';
import { EditarAlumnoDialogComponent } from './components/editar-alumno-dialog/editar-alumno-dialog.component';
import { EditarInstructorDialogComponent } from './components/editar-instructor-dialog/editar-instructor-dialog.component';

// Guards
import { AuthGuard } from './guards/auth.guard';

// Interceptors
import { ApiInterceptor } from './interceptors/api.interceptor';

// Routes
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'turnos', 
    component: TurnosComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'turnos-calendario', 
    loadComponent: () => import('./pages/turnos/turnos-calendario.component').then(m => m.TurnosCalendarioComponent)
  },
  { 
    path: 'alumnos', 
    component: AlumnosComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'instructores', 
    component: InstructoresComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'horarios', 
    component: HorariosComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'tarifas', 
    loadComponent: () => import('./pages/tarifas/tarifas.component').then(m => m.TarifasComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'pagos', 
    loadComponent: () => import('./pages/pagos/pagos.component').then(m => m.PagosComponent),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  declarations: [
    AppComponent,
    TurnosComponent,
    AlumnosComponent,
    InstructoresComponent,
    HorariosComponent,
    DashboardComponent,
    LoginComponent,
    CrearTurnoDialogComponent,
    TurnoDetallesDialogComponent,
    CrearAlumnoDialogComponent,
    CrearInstructorDialogComponent,
    EditarAlumnoDialogComponent,
    EditarInstructorDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(routes),
    
    // Angular Material Modules
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTabsModule,
    MatExpansionModule,
    MatListModule,
    MatDividerModule,
    MatBadgeModule,
    MatTooltipModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { } 