import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TouchGesturesService {
  private startX = 0;
  private startY = 0;
  private endX = 0;
  private endY = 0;
  private minSwipeDistance = 50;

  constructor(private router: Router) {}

  /**
   * Inicializa los gestos táctiles para un elemento
   */
  initTouchGestures(element: HTMLElement): void {
    element.addEventListener('touchstart', (e: TouchEvent) => {
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
    });

    element.addEventListener('touchend', (e: TouchEvent) => {
      this.endX = e.changedTouches[0].clientX;
      this.endY = e.changedTouches[0].clientY;
      this.handleSwipe();
    });
  }

  /**
   * Maneja el gesto de deslizamiento
   */
  private handleSwipe(): void {
    const deltaX = this.endX - this.startX;
    const deltaY = this.endY - this.startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance < this.minSwipeDistance) {
      return; // No es un swipe válido
    }

    // Determinar la dirección del swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Swipe horizontal
      if (deltaX > 0) {
        this.handleSwipeRight();
      } else {
        this.handleSwipeLeft();
      }
    } else {
      // Swipe vertical
      if (deltaY > 0) {
        this.handleSwipeDown();
      } else {
        this.handleSwipeUp();
      }
    }
  }

  /**
   * Maneja swipe hacia la derecha (navegación hacia atrás)
   */
  private handleSwipeRight(): void {
    // Navegar hacia atrás en el historial
    window.history.back();
  }

  /**
   * Maneja swipe hacia la izquierda (navegación hacia adelante)
   */
  private handleSwipeLeft(): void {
    // Navegar hacia adelante en el historial
    window.history.forward();
  }

  /**
   * Maneja swipe hacia abajo (actualizar página)
   */
  private handleSwipeDown(): void {
    // Actualizar la página actual
    window.location.reload();
  }

  /**
   * Maneja swipe hacia arriba (ir al inicio)
   */
  private handleSwipeUp(): void {
    // Navegar al dashboard
    this.router.navigate(['/dashboard']);
  }

  /**
   * Configura gestos específicos para una página
   */
  setupPageGestures(pageType: 'dashboard' | 'turnos' | 'alumnos' | 'instructores'): void {
    const mainContent = document.querySelector('.main-content') as HTMLElement;
    if (mainContent) {
      this.initTouchGestures(mainContent);
    }
  }

  /**
   * Limpia los gestos táctiles
   */
  cleanup(): void {
    // Remover event listeners si es necesario
  }
} 