import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  hidePassword = true;
  returnUrl: string = '/dashboard';
  matcher = new ErrorStateMatcher();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.formBuilder.group({
      nombreUsuario: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Obtener la URL de retorno si existe
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    
    // Solo redirigir si ya está autenticado Y tiene un token válido
    // No verificar autenticación si estamos en la página de login
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        const userObj = JSON.parse(user);
        if (userObj && userObj.nombreUsuario) {
          this.router.navigate([this.returnUrl]);
        }
      } catch (e) {
        // Si hay error al parsear, limpiar datos corruptos
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      
      const credentials: LoginRequest = {
        nombreUsuario: this.loginForm.get('nombreUsuario')?.value,
        password: this.loginForm.get('password')?.value
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          if (response.exitoso) {
            this.router.navigate([this.returnUrl]);
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error en login:', error);
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * Marca todos los campos del formulario como tocados para mostrar errores
   */
  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Obtiene el mensaje de error para un campo específico
   */
  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    
    if (field?.hasError('minlength')) {
      const requiredLength = field.getError('minlength').requiredLength;
      return `Mínimo ${requiredLength} caracteres`;
    }
    
    return '';
  }

  /**
   * Verifica si un campo tiene error
   */
  hasError(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }
} 