import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DebugService } from './services/debug.service';
import { AuthService } from './services/auth.service';
import { TouchGesturesService } from './services/touch-gestures.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario } from './models/auth.model';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Amo Pilates - Gestión de Turnos';
  currentUser: Usuario | null = null;
  isAuthenticated = false;
  private navigationSubscription?: Subscription;

  constructor(
    public router: Router,
    private debugService: DebugService,
    private authService: AuthService,
    private touchGesturesService: TouchGesturesService,
    private snackBar: MatSnackBar
  ) {
    // Mostrar información de debugging al cargar la aplicación
    this.debugService.logDebugInfo();
  }

  ngOnInit(): void {
    // Suscribirse al estado de autenticación
    this.authService.authState$.subscribe(state => {
      this.isAuthenticated = state.isAuthenticated;
      this.currentUser = state.user;
    });

    // Configurar gestos táctiles para navegación
    this.setupTouchGestures();
  }

  ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
    this.touchGesturesService.cleanup();
  }

  /**
   * Configura los gestos táctiles para la navegación
   */
  private setupTouchGestures(): void {
    this.navigationSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Configurar gestos según la página actual
        const currentUrl = this.router.url;
        if (currentUrl.includes('/dashboard')) {
          this.touchGesturesService.setupPageGestures('dashboard');
        } else if (currentUrl.includes('/turnos')) {
          this.touchGesturesService.setupPageGestures('turnos');
        } else if (currentUrl.includes('/alumnos')) {
          this.touchGesturesService.setupPageGestures('alumnos');
        } else if (currentUrl.includes('/instructores')) {
          this.touchGesturesService.setupPageGestures('instructores');
        }
      });
  }

  /**
   * Prueba la conexión con la API
   */
  testApiConnection(): void {
    this.debugService.testApiConnection().subscribe(
      result => {
        if (result.success) {
          this.snackBar.open('✅ Conexión exitosa con la API', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        } else {
          this.snackBar.open(`❌ Error de conexión: ${result.message}`, 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      }
    );
  }

  /**
   * Muestra información de debugging en la consola
   */
  showDebugInfo(): void {
    this.debugService.logDebugInfo();
    this.snackBar.open('📋 Información de debugging mostrada en la consola', 'Cerrar', {
      duration: 3000
    });
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    this.authService.logout();
  }

  /**
   * Obtiene el nombre completo del usuario
   */
  getUserDisplayName(): string {
    if (this.currentUser) {
      if (this.currentUser.nombre && this.currentUser.apellido) {
        return `${this.currentUser.nombre} ${this.currentUser.apellido}`;
      }
      return this.currentUser.nombreUsuario;
    }
    return '';
  }

  /**
   * Obtiene el rol del usuario
   */
  getUserRole(): string {
    return this.currentUser?.rol || '';
  }

  /**
   * Cierra el menú hamburguesa
   */
  closeMenu(): void {
    // El menú se cierra automáticamente al hacer click en un item
    // Este método se puede usar para lógica adicional si es necesario
  }
} 