import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');
    
    // Headers base
    let headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    };

    // Agregar token JWT si existe y no es una petición de autenticación
    if (token && !request.url.includes('/auth/')) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Clonar la request con los headers
    const modifiedRequest = request.clone({
      setHeaders: headers
    });

    // Manejar la respuesta y errores
    return next.handle(modifiedRequest).pipe(
      retry(1), // Reintentar una vez en caso de error
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ha ocurrido un error inesperado';
        let shouldRedirect = false;
        
        if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Error del lado del servidor
          switch (error.status) {
            case 400:
              errorMessage = 'Solicitud incorrecta';
              break;
            case 401:
              errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
              shouldRedirect = true;
              // Limpiar datos de autenticación
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              break;
            case 403:
              errorMessage = 'Acceso denegado. No tienes permisos para realizar esta acción.';
              break;
            case 404:
              errorMessage = 'Recurso no encontrado';
              break;
            case 500:
              errorMessage = 'Error interno del servidor';
              break;
            case 0:
              errorMessage = 'No se puede conectar con el servidor';
              break;
            default:
              errorMessage = `Error ${error.status}: ${error.message}`;
          }
        }

        // Mostrar mensaje de error
        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });

        // Redirigir a login si es necesario
        if (shouldRedirect) {
          this.router.navigate(['/login']);
        }

        return throwError(() => error);
      })
    );
  }
} 