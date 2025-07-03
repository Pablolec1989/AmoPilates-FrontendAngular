# Script para verificar conectividad entre Angular y API
Write-Host "🔍 VERIFICACIÓN DE CONECTIVIDAD" -ForegroundColor Yellow
Write-Host "===============================" -ForegroundColor Yellow

# Verificar si la API está ejecutándose
Write-Host "`n1️⃣ Verificando API en puerto 5000..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/swagger" -Method GET -TimeoutSec 5
    Write-Host "✅ API está ejecutándose en puerto 5000" -ForegroundColor Green
} catch {
    Write-Host "❌ API NO está ejecutándose en puerto 5000" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Ejecuta: cd AmoPilatesApp/AlumnosAPI && dotnet run" -ForegroundColor Yellow
}

# Verificar si Angular está ejecutándose
Write-Host "`n2️⃣ Verificando Angular en puerto 4200..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4200" -Method GET -TimeoutSec 5
    Write-Host "✅ Angular está ejecutándose en puerto 4200" -ForegroundColor Green
} catch {
    Write-Host "❌ Angular NO está ejecutándose en puerto 4200" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Ejecuta: cd pilates-web-app && ng serve" -ForegroundColor Yellow
}

# Verificar proxy
Write-Host "`n3️⃣ Verificando proxy de Angular..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4200/api/auth/validar-token" -Method GET -TimeoutSec 10
    Write-Host "✅ Proxy de Angular funciona correctamente" -ForegroundColor Green
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor White
} catch {
    Write-Host "❌ Proxy de Angular NO funciona" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Esto explica el error 504 Gateway Timeout" -ForegroundColor Yellow
}

Write-Host "`n🎯 RESUMEN" -ForegroundColor Yellow
Write-Host "==========" -ForegroundColor Yellow
Write-Host "Si ves errores arriba, esos son los problemas que necesitas resolver." -ForegroundColor White
Write-Host "El error 504 Gateway Timeout indica que el proxy no puede conectar con la API." -ForegroundColor White 