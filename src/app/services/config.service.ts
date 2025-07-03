import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() { }

  /**
   * Obtiene la URL base de la API
   */
  getApiUrl(): string {
    return environment.apiUrl;
  }

  /**
   * Construye una URL completa para un endpoint específico
   */
  getApiEndpoint(endpoint: string): string {
    const baseUrl = this.getApiUrl();
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
  }

  /**
   * Verifica si estamos en modo desarrollo
   */
  isDevelopment(): boolean {
    return !environment.production;
  }

  /**
   * Obtiene la configuración de timeout para las peticiones HTTP
   */
  getRequestTimeout(): number {
    return this.isDevelopment() ? 30000 : 15000; // 30s en dev, 15s en prod
  }

  /**
   * Obtiene la configuración de reintentos para las peticiones HTTP
   */
  getRetryAttempts(): number {
    return this.isDevelopment() ? 2 : 1;
  }
} 