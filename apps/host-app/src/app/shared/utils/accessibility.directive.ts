import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[appAccessibility]',
    standalone: true
})
export class AccessibilityDirective implements OnInit {
    @Input() appAccessibility: string = '';
    @Input() skipToId: string = '';

    constructor(private el: ElementRef) { }

    ngOnInit() {
        this.setupAccessibility();
    }

    private setupAccessibility() {
        const element = this.el.nativeElement;

        // Adicionar role se não existir
        if (!element.getAttribute('role')) {
            if (element.tagName === 'BUTTON') {
                element.setAttribute('role', 'button');
            } else if (element.tagName === 'A') {
                element.setAttribute('role', 'link');
            }
        }

        // Adicionar aria-label se fornecido
        if (this.appAccessibility && !element.getAttribute('aria-label')) {
            element.setAttribute('aria-label', this.appAccessibility);
        }

        // Adicionar tabindex se não existir para elementos interativos
        if (element.tagName === 'BUTTON' || element.tagName === 'A' || element.onclick) {
            if (!element.hasAttribute('tabindex')) {
                element.setAttribute('tabindex', '0');
            }
        }
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        const element = this.el.nativeElement;

        // Suporte a Enter e Space para elementos clicáveis
        if ((event.key === 'Enter' || event.key === ' ') &&
            (element.tagName === 'BUTTON' || element.tagName === 'A' || element.onclick)) {
            event.preventDefault();
            element.click();
        }

        // Suporte a Escape para fechar modais/dropdowns
        if (event.key === 'Escape') {
            const closeEvent = new CustomEvent('accessibility-close', { bubbles: true });
            element.dispatchEvent(closeEvent);
        }

        // Suporte a Tab para navegação
        if (event.key === 'Tab') {
            // Adicionar indicador visual de foco
            element.classList.add('keyboard-focus');
        }
    }

    @HostListener('keyup', ['$event'])
    onKeyUp(event: KeyboardEvent) {
        if (event.key === 'Tab') {
            // Remover indicador visual de foco após um tempo
            setTimeout(() => {
                this.el.nativeElement.classList.remove('keyboard-focus');
            }, 100);
        }
    }

    @HostListener('focus')
    onFocus() {
        // Adicionar classe para indicar foco
        this.el.nativeElement.classList.add('accessibility-focus');
    }

    @HostListener('blur')
    onBlur() {
        // Remover classe de foco
        this.el.nativeElement.classList.remove('accessibility-focus');
    }

    @HostListener('click')
    onClick() {
        // Se skipToId for fornecido, focar no elemento
        if (this.skipToId) {
            const targetElement = document.getElementById(this.skipToId);
            if (targetElement) {
                targetElement.focus();
            }
        }
    }
} 