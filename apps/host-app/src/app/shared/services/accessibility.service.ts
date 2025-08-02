import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  private liveRegion: HTMLElement | null = null;

  constructor() {
    this.createLiveRegion();
  }

  private createLiveRegion() {
    // Criar região ao vivo para leitores de tela
    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.setAttribute('class', 'sr-only');
    this.liveRegion.style.position = 'absolute';
    this.liveRegion.style.left = '-10000px';
    this.liveRegion.style.width = '1px';
    this.liveRegion.style.height = '1px';
    this.liveRegion.style.overflow = 'hidden';

    document.body.appendChild(this.liveRegion);
  }

  /**
   * Anuncia uma mensagem para leitores de tela
   */
  announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    if (this.liveRegion) {
      this.liveRegion.setAttribute('aria-live', priority);
      this.liveRegion.textContent = message;

      // Limpar a mensagem após um tempo para permitir múltiplas anúncios
      setTimeout(() => {
        if (this.liveRegion) {
          this.liveRegion.textContent = '';
        }
      }, 1000);
    }
  }

  /**
   * Anuncia uma mensagem de erro
   */
  announceError(message: string) {
    this.announce(`Erro: ${message}`, 'assertive');
  }

  /**
   * Anuncia uma mensagem de sucesso
   */
  announceSuccess(message: string) {
    this.announce(`Sucesso: ${message}`, 'polite');
  }

  /**
   * Anuncia uma mudança de página
   */
  announcePageChange(pageTitle: string) {
    this.announce(`Página carregada: ${pageTitle}`, 'polite');
  }

  /**
   * Anuncia uma mudança de status
   */
  announceStatus(status: string) {
    this.announce(`Status: ${status}`, 'polite');
  }

  /**
   * Foca em um elemento específico
   */
  focusElement(elementId: string) {
    const element = document.getElementById(elementId);
    if (element) {
      element.focus();
      this.announce(`Foco movido para ${element.textContent || elementId}`);
    }
  }

  /**
   * Verifica se o usuário está navegando por teclado
   */
  isKeyboardNavigation(): boolean {
    const activeElement = document.activeElement;
    return activeElement?.tagName === 'INPUT' ||
      activeElement?.tagName === 'BUTTON' ||
      activeElement?.tagName === 'A' ||
      (activeElement?.hasAttribute('tabindex') ?? false);
  }

  /**
   * Adiciona indicador visual de foco para navegação por teclado
   */
  addKeyboardFocusIndicator(element: HTMLElement) {
    element.classList.add('keyboard-focus');
  }

  /**
   * Remove indicador visual de foco
   */
  removeKeyboardFocusIndicator(element: HTMLElement) {
    element.classList.remove('keyboard-focus');
  }

  /**
   * Verifica contraste de cores
   */
  checkColorContrast(foreground: string, background: string): number {
    // Implementação simplificada do cálculo de contraste
    const getLuminance = (color: string) => {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16) / 255;
      const g = parseInt(hex.substr(2, 2), 16) / 255;
      const b = parseInt(hex.substr(4, 2), 16) / 255;

      const [rs, gs, bs] = [r, g, b].map(c => {
        if (c <= 0.03928) {
          return c / 12.92;
        }
        return Math.pow((c + 0.055) / 1.055, 2.4);
      });

      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const l1 = getLuminance(foreground);
    const l2 = getLuminance(background);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Verifica se o contraste atende aos padrões WCAG
   */
  isContrastCompliant(foreground: string, background: string, level: 'AA' | 'AAA' = 'AA'): boolean {
    const contrast = this.checkColorContrast(foreground, background);
    const threshold = level === 'AA' ? 4.5 : 7;
    return contrast >= threshold;
  }

  /**
   * Destroi o serviço
   */
  destroy() {
    if (this.liveRegion && this.liveRegion.parentNode) {
      this.liveRegion.parentNode.removeChild(this.liveRegion);
    }
  }
} 