import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkAuth(route, state);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkAuth(childRoute, state);
  }

  private checkAuth(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // Verificar si el usuario está autenticado localmente
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url } 
      });
      return of(false);
    }

    // Verificar roles si están especificados en la ruta
    const requiredRoles = route.data['roles'] as string[];
    if (requiredRoles && requiredRoles.length > 0) {
      if (!this.authService.hasAnyRole(requiredRoles)) {
        // Usuario no tiene los roles requeridos
        this.router.navigate(['/unauthorized']);
        return of(false);
      }
    }

    // Verificar que existe un token
    const token = this.authService.getToken();
    if (!token) {
      this.authService.logout();
      return of(false);
    }

    // Permitir acceso sin validar token con el servidor
    // La validación del token se hará en el interceptor HTTP
    return of(true);
  }
} 