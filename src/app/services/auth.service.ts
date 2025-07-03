import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { 
  LoginRequest, 
  RegistroRequest, 
  AuthResponse, 
  Usuario, 
  CambioPasswordRequest,
  AuthState 
} from '../models/auth.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL: string;
  
  // BehaviorSubject para el estado de autenticación
  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private configService: ConfigService
  ) {
    this.API_URL = this.configService.getApiUrl();
    this.initializeAuthState();
  }

  /**
   * Inicializa el estado de autenticación desde localStorage
   */
  private initializeAuthState(): void {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.authStateSubject.next({
          isAuthenticated: true,
          user: user,
          token: token,
          loading: false,
          error: null
        });
      } catch (error) {
        this.clearAuthData();
      }
    }
  }

  /**
   * Obtiene el estado actual de autenticación
   */
  getAuthState(): AuthState {
    return this.authStateSubject.value;
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  /**
   * Obtiene el token actual
   */
  getToken(): string | null {
    return this.authStateSubject.value.token;
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser(): Usuario | null {
    return this.authStateSubject.value.user;
  }

  /**
   * Verifica si el usuario tiene un rol específico
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.rol === role;
  }

  /**
   * Verifica si el usuario tiene alguno de los roles especificados
   */
  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.rol) : false;
  }

  /**
   * Inicia sesión
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    this.setLoading(true);
    
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response.exitoso && response.token && response.usuario) {
            this.setAuthData(response.token, response.usuario);
            this.snackBar.open('✅ Inicio de sesión exitoso', 'Cerrar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          } else {
            this.setError(response.mensaje || 'Error en el inicio de sesión');
            this.snackBar.open(`❌ ${response.mensaje || 'Error en el inicio de sesión'}`, 'Cerrar', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        }),
        catchError(error => {
          this.setError('Error de conexión con el servidor');
          this.snackBar.open('❌ Error de conexión con el servidor', 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          return throwError(() => error);
        }),
        map(response => {
          this.setLoading(false);
          return response;
        })
      );
  }

  /**
   * Registra un nuevo usuario
   */
  registro(userData: RegistroRequest): Observable<AuthResponse> {
    this.setLoading(true);
    
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/registro`, userData)
      .pipe(
        tap(response => {
          if (response.exitoso && response.token && response.usuario) {
            this.setAuthData(response.token, response.usuario);
            this.snackBar.open('✅ Usuario registrado exitosamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          } else {
            this.setError(response.mensaje || 'Error en el registro');
            this.snackBar.open(`❌ ${response.mensaje || 'Error en el registro'}`, 'Cerrar', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        }),
        catchError(error => {
          this.setError('Error de conexión con el servidor');
          this.snackBar.open('❌ Error de conexión con el servidor', 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          return throwError(() => error);
        }),
        map(response => {
          this.setLoading(false);
          return response;
        })
      );
  }

  /**
   * Cierra sesión
   */
  logout(): void {
    this.clearAuthData();
    this.snackBar.open('👋 Sesión cerrada', 'Cerrar', {
      duration: 2000
    });
    this.router.navigate(['/login']);
  }

  /**
   * Cambia la contraseña del usuario actual
   */
  cambiarPassword(passwordData: CambioPasswordRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/cambiar-password`, passwordData)
      .pipe(
        tap(response => {
          if (response.exitoso) {
            this.snackBar.open('✅ Contraseña cambiada exitosamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          } else {
            this.snackBar.open(`❌ ${response.mensaje || 'Error al cambiar contraseña'}`, 'Cerrar', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        }),
        catchError(error => {
          this.snackBar.open('❌ Error de conexión con el servidor', 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          return throwError(() => error);
        })
      );
  }

  /**
   * Obtiene el perfil del usuario actual
   */
  obtenerPerfil(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API_URL}/auth/perfil`);
  }

  /**
   * Valida el token actual
   */
  validarToken(): Observable<boolean> {
    return this.http.get<{valido: boolean, mensaje: string}>(`${this.API_URL}/auth/validar-token`)
      .pipe(
        map(response => response.valido),
        catchError(() => {
          this.logout();
          return throwError(() => new Error('Token inválido'));
        })
      );
  }

  /**
   * Establece los datos de autenticación
   */
  private setAuthData(token: string, user: Usuario): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    this.authStateSubject.next({
      isAuthenticated: true,
      user: user,
      token: token,
      loading: false,
      error: null
    });
  }

  /**
   * Limpia los datos de autenticación
   */
  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    this.authStateSubject.next({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null
    });
  }

  /**
   * Establece el estado de carga
   */
  private setLoading(loading: boolean): void {
    const currentState = this.authStateSubject.value;
    this.authStateSubject.next({
      ...currentState,
      loading: loading
    });
  }

  /**
   * Establece un error
   */
  private setError(error: string): void {
    const currentState = this.authStateSubject.value;
    this.authStateSubject.next({
      ...currentState,
      error: error,
      loading: false
    });
  }
} 