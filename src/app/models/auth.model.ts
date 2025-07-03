export interface LoginRequest {
  nombreUsuario: string;
  password: string;
}

export interface RegistroRequest {
  nombreUsuario: string;
  email: string;
  password: string;
  nombre?: string;
  apellido?: string;
  rol?: string;
}

export interface Usuario {
  id: number;
  nombreUsuario: string;
  email: string;
  nombre?: string;
  apellido?: string;
  rol: string;
  activo: boolean;
  fechaCreacion: string;
  ultimoAcceso?: string;
}

export interface AuthResponse {
  exitoso: boolean;
  token?: string;
  mensaje?: string;
  usuario?: Usuario;
  expiracion?: string;
}

export interface CambioPasswordRequest {
  passwordActual: string;
  nuevaPassword: string;
  confirmarPassword: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: Usuario | null;
  token: string | null;
  loading: boolean;
  error: string | null;
} 