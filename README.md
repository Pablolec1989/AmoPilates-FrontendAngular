# Amo Pilates - Aplicación Web

Esta es una aplicación web desarrollada en Angular que replica las funcionalidades del sistema de gestión de turnos de Pilates Desktop.

## Características

- **Gestión de Turnos**: Crear, editar y eliminar turnos de Pilates
- **Gestión de Alumnos**: Administrar información de alumnos con paginación
- **Gestión de Instructores**: Gestionar instructores y sus porcentajes de pago
- **Gestión de Horarios**: Configurar horarios disponibles
- **Gestión de Tarifas**: Administrar tarifas por cantidad de turnos
- **Reportes**: Ver ganancias por instructor y totales
- **Interfaz Moderna**: Diseño responsive con Angular Material

## Tecnologías Utilizadas

- **Angular 17**: Framework principal
- **Angular Material**: Componentes de UI
- **TypeScript**: Lenguaje de programación
- **SCSS**: Estilos avanzados
- **RxJS**: Programación reactiva

## Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone <url-del-repositorio>
   cd pilates-web-app
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**:
   ```bash
   npm start
   ```

4. **Abrir en el navegador**:
   ```
   http://localhost:4200
   ```

## Estructura del Proyecto

```
src/
├── app/
│   ├── components/          # Componentes reutilizables
│   ├── models/             # Interfaces y tipos TypeScript
│   ├── pages/              # Páginas principales
│   ├── services/           # Servicios de API
│   ├── app.component.*     # Componente principal
│   └── app.module.ts       # Módulo principal
├── assets/                 # Recursos estáticos
├── styles.scss            # Estilos globales
└── main.ts               # Punto de entrada
```

## API Backend

La aplicación se conecta a la API backend en:
```
http://www.amopilatesgaiman.somee.com/api
```

### Endpoints Principales

- `GET /turnos` - Obtener todos los turnos
- `POST /turnos` - Crear nuevo turno
- `PUT /turnos/{id}` - Actualizar turno
- `DELETE /turnos/{id}` - Eliminar turno

- `GET /alumnos` - Obtener alumnos
- `GET /alumnos/paginados` - Obtener alumnos con paginación
- `POST /alumnos` - Crear nuevo alumno
- `PUT /alumnos/{id}` - Actualizar alumno
- `DELETE /alumnos/{id}` - Eliminar alumno

- `GET /instructores` - Obtener instructores
- `POST /instructores` - Crear nuevo instructor
- `PUT /instructores/{id}` - Actualizar instructor
- `DELETE /instructores/{id}` - Eliminar instructor

- `GET /horarios` - Obtener horarios
- `POST /horarios` - Crear nuevo horario
- `PUT /horarios/{id}` - Actualizar horario
- `DELETE /horarios/{id}` - Eliminar horario

- `GET /tarifas` - Obtener tarifas
- `POST /tarifas` - Crear nueva tarifa
- `PUT /tarifas/{id}` - Actualizar tarifa
- `DELETE /tarifas/{id}` - Eliminar tarifa

## Funcionalidades Principales

### Dashboard
- Vista principal con botones de acceso rápido a todas las funcionalidades
- Diseño responsive y moderno

### Gestión de Turnos
- Lista de turnos con paginación
- Filtros por día de la semana
- Crear, editar y eliminar turnos
- Asignar instructores y alumnos
- Control de cupos disponibles

### Gestión de Alumnos
- Lista de alumnos con paginación
- Filtros por estado activo y cuota pagada
- Búsqueda por apellido
- Crear, editar y eliminar alumnos
- Gestión de turnos asignados
- Envío de mensajes por WhatsApp

### Gestión de Instructores
- Lista de instructores
- Crear, editar y eliminar instructores
- Configuración de porcentaje de pago
- Control de estado activo

### Gestión de Horarios
- Configuración de horarios disponibles
- Asignación de días de la semana
- Gestión de horas de clase

### Gestión de Tarifas
- Configuración de tarifas por cantidad de turnos
- Precios personalizables
- Gestión completa de tarifas

### Reportes
- Ganancias por instructor
- Ganancias totales
- Reinicio de cuotas de alumnos

## Scripts Disponibles

- `npm start` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run watch` - Construir en modo watch
- `npm test` - Ejecutar pruebas

## Configuración de Desarrollo

### Prerrequisitos
- Node.js (versión 16 o superior)
- Angular CLI (`npm install -g @angular/cli`)
- .NET 8 SDK
- SQL Server (local o remoto)

### Pasos para ejecutar en desarrollo

1. **Iniciar la API (.NET)**
   ```bash
   cd AmoPilatesApp/AlumnosAPI
   dotnet run
   ```
   La API estará disponible en: `http://localhost:5000`

2. **Iniciar el frontend (Angular)**
   ```bash
   cd pilates-web-app
   npm install
   npm start
   ```
   El frontend estará disponible en: `http://localhost:4200`

### Configuración del Proxy

El proyecto está configurado para usar un proxy que redirige las peticiones `/api` del frontend a la API local (`http://localhost:5000`).

Archivo de configuración: `proxy.conf.json`

### Solución de Problemas de Conexión

Si el frontend no se conecta con la API:

1. **Verificar que la API esté ejecutándose**
   - Abrir `http://localhost:5000/swagger` en el navegador
   - Debería mostrar la documentación de Swagger

2. **Verificar la configuración del proxy**
   - El archivo `proxy.conf.json` debe apuntar a `http://localhost:5000`
   - Reiniciar el servidor de Angular después de cambios

3. **Verificar CORS**
   - La API está configurada para permitir todas las conexiones en desarrollo
   - En producción usa políticas más restrictivas

4. **Verificar las URLs de la API**
   - Los controladores usan la ruta `api/[controller]`
   - El frontend hace peticiones a `/api/[endpoint]`

### Scripts disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm run start:dev` - Inicia en modo desarrollo explícito
- `npm run start:prod` - Inicia en modo producción (usa API remota)
- `npm run build` - Construye la aplicación para producción

### Entornos

- **Desarrollo**: Usa API local (`http://localhost:5000`)
- **Producción**: Usa API remota (`http://www.amopilatesgaiman.somee.com/api`)

### Estructura del Proyecto

```
pilates-web-app/
├── src/
│   ├── app/
│   │   ├── services/
│   │   │   ├── api.service.ts      # Servicio principal de API
│   │   │   └── config.service.ts   # Configuración de la aplicación
│   │   └── ...
│   └── environments/
│       ├── environment.ts          # Configuración de desarrollo
│       └── environment.prod.ts     # Configuración de producción
├── proxy.conf.json                 # Configuración del proxy
└── angular.json                    # Configuración de Angular
```

## Configuración de CORS y Acceso a la API

### Backend (.NET Core API)

La API ya está configurada con políticas de CORS específicas:

#### Políticas de CORS Configuradas:

1. **DevelopmentPolicy** (Desarrollo):
   - `http://localhost:4200`
   - `http://localhost:4201`
   - `http://127.0.0.1:4200`
   - `http://127.0.0.1:4201`

2. **ProductionPolicy** (Producción):
   - `https://amopilatesgaiman.somee.com`
   - `http://amopilatesgaiman.somee.com`
   - `https://www.amopilatesgaiman.somee.com`
   - `http://www.amopilatesgaiman.somee.com`

3. **AllowAll** (Solo para desarrollo):
   - Permite cualquier origen (no usar en producción)

### Frontend (Angular)

#### Configuración de Entornos:

- **Desarrollo** (`environment.ts`): Usa proxy local (`/api`)
- **Producción** (`environment.prod.ts`): Usa URL completa de la API

#### Proxy de Desarrollo:

El archivo `proxy.conf.json` está configurado para redirigir las peticiones `/api` a la API remota durante el desarrollo.

#### Interceptor HTTP:

Se ha implementado un interceptor que:
- Agrega headers automáticamente
- Maneja errores de red
- Implementa reintentos automáticos
- Configura timeouts

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Contacto

Para preguntas o soporte, contacta al equipo de desarrollo. 