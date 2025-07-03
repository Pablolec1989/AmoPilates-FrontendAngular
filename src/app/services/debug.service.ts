import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class DebugService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  /**
   * Verifica la conectividad con la API
   */
  testApiConnection(): Observable<any> {
    const testUrl = this.configService.getApiEndpoint('alumnos');
    
    console.log('🔍 Probando conexión con la API...');
    console.log('📍 URL de prueba:', testUrl);
    console.log('🌐 URL base:', this.configService.getApiUrl());
    
    return this.http.get(testUrl).pipe(
      map(response => {
        console.log('✅ Conexión exitosa:', response);
        return {
          success: true,
          message: 'Conexión exitosa con la API',
          data: response
        };
      }),
      catchError(error => {
        console.error('❌ Error de conexión:', error);
        return of({
          success: false,
          message: `Error de conexión: ${error.message}`,
          error: error
        });
      })
    );
  }

  /**
   * Verifica la configuración del entorno
   */
  getEnvironmentInfo(): any {
    return {
      production: this.configService.isDevelopment() ? false : true,
      apiUrl: this.configService.getApiUrl(),
      timeout: this.configService.getRequestTimeout(),
      retryAttempts: this.configService.getRetryAttempts(),
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Realiza una petición de prueba simple
   */
  pingApi(): Observable<any> {
    const pingUrl = this.configService.getApiEndpoint('alumnos');
    
    return this.http.get(pingUrl, { 
      observe: 'response',
      responseType: 'text'
    }).pipe(
      map(response => ({
        success: true,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        url: response.url
      })),
      catchError(error => of({
        success: false,
        error: error.message,
        status: error.status,
        statusText: error.statusText
      }))
    );
  }

  /**
   * Muestra información de debugging en la consola
   */
  logDebugInfo(): void {
    console.group('🐛 Información de Debugging');
    console.log('Entorno:', this.getEnvironmentInfo());
    console.log('Configuración de API:', {
      baseUrl: this.configService.getApiUrl(),
      timeout: this.configService.getRequestTimeout(),
      retryAttempts: this.configService.getRetryAttempts()
    });
    console.log('Navegador:', {
      userAgent: navigator.userAgent,
      language: navigator.language,
      onLine: navigator.onLine
    });
    console.groupEnd();
  }
} 