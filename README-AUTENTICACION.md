# Sistema de Autenticación - Frontend Angular

## 🔐 Resumen del Sistema Implementado

Se ha implementado un sistema completo de autenticación JWT para el frontend Angular que se integra con la API protegida.

### 🎯 Características Principales

1. **Login/Logout** con JWT
2. **Protección de rutas** con Guards
3. **Interceptor HTTP** para tokens automáticos
4. **Gestión de estado** de autenticación
5. **Validación de tokens** con el servidor
6. **Manejo de errores** de autenticación
7. **UI responsive** y moderna

## 📁 Estructura de Archivos

### Modelos
- `src/app/models/auth.model.ts` - Interfaces para autenticación

### Servicios
- `src/app/services/auth.service.ts` - Servicio principal de autenticación

### Componentes
- `src/app/pages/login/login.component.ts` - Componente de login
- `src/app/pages/login/login.component.html` - Template de login
- `src/app/pages/login/login.component.scss` - Estilos de login

### Guards
- `src/app/guards/auth.guard.ts` - Guard para proteger rutas

### Interceptors
- `src/app/interceptors/api.interceptor.ts` - Interceptor para tokens JWT

## 🚀 Cómo Funciona

### 1. Flujo de Login
```
Usuario ingresa credenciales → AuthService.login() → API /auth/login → 
Token JWT → localStorage → Redirección a dashboard
```

### 2. Protección de Rutas
```
Usuario accede a ruta → AuthGuard.canActivate() → Verificar token → 
Validar con servidor → Permitir/Denegar acceso
```

### 3. Interceptor HTTP
```
Petición HTTP → ApiInterceptor → Agregar token JWT → Enviar petición → 
Manejar errores 401/403 → Redirección a login
```

## 🔧 Configuración

### Rutas Protegidas
```typescript
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  // ... más rutas protegidas
];
```

### Interceptor Configurado
```typescript
providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ApiInterceptor,
    multi: true
  }
]
```

## 👤 Credenciales de Demo

- **Usuario**: `admin`
- **Contraseña**: `admin123`
- **Rol**: `Admin`

## 🛡️ Seguridad Implementada

### 1. Validación de Tokens
- Verificación automática con el servidor
- Limpieza de datos si el token es inválido
- Redirección automática a login

### 2. Manejo de Errores
- Error 401: Sesión expirada → Redirección a login
- Error 403: Acceso denegado → Mensaje informativo
- Errores de conexión → Mensajes claros

### 3. Almacenamiento Seguro
- Token JWT en localStorage
- Datos de usuario en localStorage
- Limpieza automática al logout

## 📱 Características de la UI

### Login Page
- ✅ Diseño moderno y responsive
- ✅ Validación de formularios en tiempo real
- ✅ Indicador de carga durante login
- ✅ Mensajes de error claros
- ✅ Credenciales de demo visibles

### Toolbar Principal
- ✅ Información del usuario autenticado
- ✅ Botón de logout
- ✅ Botones de debugging
- ✅ Menú de navegación

### Responsive Design
- ✅ Funciona en móviles y desktop
- ✅ Adaptación automática de layout
- ✅ Snackbars posicionados correctamente

## 🔄 Estados de Autenticación

### AuthState Interface
```typescript
interface AuthState {
  isAuthenticated: boolean;
  user: Usuario | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
```

### BehaviorSubject
- Estado reactivo en tiempo real
- Suscripción automática en componentes
- Actualización automática de UI

## 🧪 Funcionalidades de Testing

### Botones de Debug
- **Test API Connection**: Prueba conexión con la API
- **Show Debug Info**: Muestra información en consola
- **Logout**: Cierra sesión y limpia datos

### Validación de Token
- Verificación automática al cargar la app
- Validación periódica con el servidor
- Manejo de tokens expirados

## 📋 Endpoints Utilizados

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/registro` - Registrar usuario
- `GET /api/auth/perfil` - Obtener perfil
- `GET /api/auth/validar-token` - Validar token
- `POST /api/auth/cambiar-password` - Cambiar contraseña

### Headers Automáticos
```typescript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
```

## 🚀 Próximos Pasos Recomendados

1. **Implementar refresh tokens** para mayor seguridad
2. **Agregar registro de usuarios** desde el frontend
3. **Implementar cambio de contraseña** en perfil
4. **Agregar roles específicos** para diferentes funcionalidades
5. **Implementar "Recordar sesión"** opcional
6. **Agregar logging de auditoría** para acciones sensibles

## 🔧 Troubleshooting

### Problemas Comunes

1. **Token no se envía**
   - Verificar que el interceptor esté configurado
   - Verificar que el token esté en localStorage

2. **Error 401 persistente**
   - Limpiar localStorage manualmente
   - Verificar que la API esté funcionando

3. **Redirección infinita**
   - Verificar configuración de rutas
   - Verificar que el guard no tenga lógica circular

### Comandos de Debug
```bash
# Verificar token en localStorage
localStorage.getItem('token')

# Limpiar datos de autenticación
localStorage.removeItem('token')
localStorage.removeItem('user')

# Verificar estado de autenticación
console.log(authService.getAuthState())
```

## 📝 Notas Técnicas

- **Angular Material**: UI components modernos
- **Reactive Forms**: Validación robusta
- **RxJS**: Manejo reactivo de estado
- **JWT**: Tokens seguros y stateless
- **Guards**: Protección de rutas
- **Interceptors**: Automatización de headers 