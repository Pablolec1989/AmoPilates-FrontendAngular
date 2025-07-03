export interface Turno {
  id: number;
  horario: Horario;
  capacidad: number;
  cuposDisponibles: number;
  alumnos: Alumno[];
  instructor: Instructor;
}

export interface Horario {
  id: number;
  dia: number;
  diaNombre: string;
  hora: string;
}

export interface Alumno {
  id: number;
  nombre: string;
  apellido: string;
  telefono?: string;
  observaciones?: string;
  cuotaPagada: boolean;
  activo: boolean;
  // Propiedades calculadas para compatibilidad
  fechaNacimiento?: Date;
  edad?: number;
}

export interface Instructor {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  porcentajePago: number;
  activo: boolean;
}

export interface Tarifa {
  id: number;
  cantidadTurnos: number;
  precio: number;
}

// DTOs para crear y actualizar
export interface CreateTurnoDTO {
  horarioId: number;
  instructorId: number;
  capacidad: number;
  alumnosIds?: number[];
}

export interface UpdateTurnoDTO {
  id: number;
  horarioId: number;
  instructorId: number;
  capacidad: number;
  alumnosIds?: number[];
}

export interface CreateAlumnoDTO {
  nombre: string;
  apellido: string;
  telefono?: string;
  observaciones?: string;
  cuotaPagada: boolean;
  activo: boolean;
  turnosIds?: number[];
}

export interface UpdateAlumnoDTO {
  id: number;
  nombre: string;
  apellido: string;
  telefono?: string;
  observaciones?: string;
  cuotaPagada: boolean;
  activo: boolean;
  turnosIds?: number[];
}

export interface CreateTarifaDTO {
  cantidadTurnos: number;
  precio: number;
}

export interface UpdateTarifaDTO {
  id: number;
  cantidadTurnos: number;
  precio: number;
} 