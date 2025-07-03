import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, timeout, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ConfigService } from './config.service';
import {
  Turno,
  Alumno,
  Instructor,
  Horario,
  Tarifa,
  CreateTurnoDTO,
  UpdateTurnoDTO,
  CreateAlumnoDTO,
  UpdateAlumnoDTO,
  CreateTarifaDTO,
  UpdateTarifaDTO
} from '../models/turno.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.baseUrl = this.configService.getApiUrl();
  }

  // Método privado para manejar errores
  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError(() => error);
  }

  // Método privado para construir URLs
  private buildUrl(endpoint: string): string {
    return this.configService.getApiEndpoint(endpoint);
  }

  // Turnos
  getTurnos(): Observable<Turno[]> {
    return this.http.get<Turno[]>(this.buildUrl('turnos'))
      .pipe(
        timeout(this.configService.getRequestTimeout()),
        retry(this.configService.getRetryAttempts()),
        catchError(this.handleError)
      );
  }

  createTurno(turnoDto: CreateTurnoDTO): Observable<Turno> {
    return this.http.post<Turno>(this.buildUrl('turnos'), turnoDto, this.httpOptions)
      .pipe(
        timeout(this.configService.getRequestTimeout()),
        retry(this.configService.getRetryAttempts()),
        catchError(this.handleError)
      );
  }

  updateTurno(id: number, turnoDto: UpdateTurnoDTO): Observable<boolean> {
    return this.http.put(this.buildUrl(`turnos/${id}`), turnoDto, this.httpOptions)
      .pipe(
        timeout(this.configService.getRequestTimeout()),
        retry(this.configService.getRetryAttempts()),
        map(() => true),
        catchError(this.handleError)
      );
  }

  deleteTurno(id: number): Observable<boolean> {
    return this.http.delete(this.buildUrl(`turnos/${id}`))
      .pipe(
        timeout(this.configService.getRequestTimeout()),
        retry(this.configService.getRetryAttempts()),
        map(() => true),
        catchError(this.handleError)
      );
  }

  // Alumnos
  getAlumnos(soloActivos: boolean = true): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.buildUrl(`alumnos?soloActivos=${soloActivos}`))
      .pipe(
        timeout(this.configService.getRequestTimeout()),
        retry(this.configService.getRetryAttempts()),
        catchError(this.handleError)
      );
  }

  getAlumnosPaginados(
    page: number = 1, 
    pageSize: number = 20, 
    soloActivos: boolean = true,
    cuotaPagada?: boolean,
    apellido?: string
  ): Observable<any> {
    let url = this.buildUrl(`alumnos?page=${page}&pageSize=${pageSize}&soloActivos=${soloActivos}`);
    
    if (cuotaPagada !== undefined) {
      url += `&cuotaPagada=${cuotaPagada}`;
    }
    
    if (apellido && apellido.trim()) {
      url += `&apellido=${encodeURIComponent(apellido.trim())}`;
    }
    
    // Log de depuración para verificar la URL construida
    console.log('URL de API construida:', url);
    
    return this.http.get<any>(url)
      .pipe(
        timeout(this.configService.getRequestTimeout()),
        retry(this.configService.getRetryAttempts()),
        catchError(this.handleError)
      );
  }

  createAlumno(alumnoDto: CreateAlumnoDTO): Observable<Alumno> {
    return this.http.post<Alumno>(this.buildUrl('alumnos'), alumnoDto, this.httpOptions)
      .pipe(
        timeout(this.configService.getRequestTimeout()),
        retry(this.configService.getRetryAttempts()),
        catchError(this.handleError)
      );
  }

  updateAlumno(id: number, alumnoDto: UpdateAlumnoDTO): Observable<boolean> {
    return this.http.put(this.buildUrl(`alumnos/${id}`), alumnoDto, this.httpOptions)
      .pipe(
        timeout(this.configService.getRequestTimeout()),
        retry(this.configService.getRetryAttempts()),
        map(() => true),
        catchError(this.handleError)
      );
  }

  deleteAlumno(id: number): Observable<boolean> {
    return this.http.delete(this.buildUrl(`alumnos/${id}`))
      .pipe(
        timeout(this.configService.getRequestTimeout()),
        retry(this.configService.getRetryAttempts()),
        map(() => true),
        catchError(this.handleError)
      );
  }

  updateAlumnoTurnos(alumnoId: number, turnosIds: number[]): Observable<boolean> {
    return this.http.put(this.buildUrl(`alumnos/${alumnoId}/turnos`), { turnosIds }, this.httpOptions)
      .pipe(
        timeout(this.configService.getRequestTimeout()),
        retry(this.configService.getRetryAttempts()),
        map(() => true),
        catchError(this.handleError)
      );
  }

  // Instructores
  getInstructores(soloActivos: boolean = true): Observable<Instructor[]> {
    return this.http.get<Instructor[]>(this.buildUrl(`instructores?soloActivos=${soloActivos}`))
      .pipe(
        timeout(this.configService.getRequestTimeout()),
        retry(this.configService.getRetryAttempts()),
        catchError(this.handleError)
      );
  }

  createInstructor(instructor: Instructor): Observable<Instructor> {
    return this.http.post<Instructor>(this.buildUrl('instructores'), instructor, this.httpOptions)
      .pipe(
        timeout(this.configService.getRequestTimeout()),
        retry(this.configService.getRetryAttempts()),
        catchError(this.handleError)
      );
  }

  updateInstructor(id: number, instructor: any): Observable<boolean> {
    return this.http.put(this.buildUrl(`instructores/${id}`), instructor, this.httpOptions)
      .pipe(
        timeout(this.configService.getRequestTimeout()),
        retry(this.configService.getRetryAttempts()),
        map(() => true),
        catchError(this.handleError)
      );
  }

  deleteInstructor(id: number): Observable<boolean> {
    return this.http.delete(this.buildUrl(`instructores/${id}`))
      .pipe(
        timeout(this.configService.getRequestTimeout()),
        retry(this.configService.getRetryAttempts()),
        map(() => true),
        catchError(this.handleError)
      );
  }

  // Horarios
  getHorarios(): Observable<Horario[]> {
    return this.http.get<Horario[]>(this.buildUrl('horarios'))
      .pipe(
        timeout(this.configService.getRequestTimeout()),
        retry(this.configService.getRetryAttempts()),
        catchError(this.handleError)
      );
  }

  createHorario(horario: Horario): Observable<Horario> {
    return this.http.post<Horario>(this.buildUrl('horarios'), horario, this.httpOptions)
      .pipe(
        timeout(this.configService.getRequestTimeout()),
        retry(this.configService.getRetryAttempts()),
        catchError(this.handleError)
      );
  }

  updateHorario(id: number, horario: Horario): Observable<boolean> {
    return this.http.put(this.buildUrl(`horarios/${id}`), horario, this.httpOptions)
      .pipe(
        timeout(this.configService.getRequestTimeout()),
        retry(this.configService.getRetryAttempts()),
        map(() => true),
        catchError(this.handleError)
      );
  }

  deleteHorario(id: number): Observable<boolean> {
    return this.http.delete(this.buildUrl(`horarios/${id}`))
      .pipe(
        timeout(this.configService.getRequestTimeout()),
        retry(this.configService.getRetryAttempts()),
        map(() => true),
        catchError(this.handleError)
      );
  }

  // Tarifas
  getTarifas(): Observable<Tarifa[]> {
    return this.http.get<Tarifa[]>(this.buildUrl('tarifas'))
      .pipe(
        timeout(this.configService.getRequestTimeout()),
        retry(this.configService.getRetryAttempts()),
        catchError(this.handleError)
      );
  }

  createTarifa(tarifaDto: CreateTarifaDTO): Observable<Tarifa> {
    return this.http.post<Tarifa>(this.buildUrl('tarifas'), tarifaDto, this.httpOptions)
      .pipe(
        timeout(this.configService.getRequestTimeout()),
        retry(this.configService.getRetryAttempts()),
        catchError(this.handleError)
      );
  }

  updateTarifa(id: number, tarifaDto: UpdateTarifaDTO): Observable<boolean> {
    return this.http.put(this.buildUrl(`tarifas/${id}`), tarifaDto, this.httpOptions)
      .pipe(
        timeout(this.configService.getRequestTimeout()),
        retry(this.configService.getRetryAttempts()),
        map(() => true),
        catchError(this.handleError)
      );
  }

  deleteTarifa(id: number): Observable<boolean> {
    return this.http.delete(this.buildUrl(`tarifas/${id}`))
      .pipe(
        timeout(this.configService.getRequestTimeout()),
        retry(this.configService.getRetryAttempts()),
        map(() => true),
        catchError(this.handleError)
      );
  }

  // Reportes
  getGananciasPorInstructor(): Observable<any> {
    return this.http.get<any>(this.buildUrl('instructores/ganancias'))
      .pipe(
        timeout(this.configService.getRequestTimeout()),
        retry(this.configService.getRetryAttempts()),
        catchError(this.handleError)
      );
  }

  getGananciaTotal(): Observable<any> {
    return this.http.get<any>(this.buildUrl('reportes/ganancia-total'))
      .pipe(
        timeout(this.configService.getRequestTimeout()),
        retry(this.configService.getRetryAttempts()),
        catchError(this.handleError)
      );
  }

  reiniciarCuotasAlumnos(): Observable<boolean> {
    return this.http.post(this.buildUrl('alumnos/reiniciar-cuotas'), {})
      .pipe(
        timeout(this.configService.getRequestTimeout()),
        retry(this.configService.getRetryAttempts()),
        map(() => true),
        catchError(this.handleError)
      );
  }
} 