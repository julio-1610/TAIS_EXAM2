import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-confirmation',
  imports: [CommonModule],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css'
})
export class ConfirmationComponent {
  @Input() message: string = 'Action confirmed!'; // Mensaje por defecto
  @Input() type: string = 'info'; // Tipo de alerta (info, success, warning, etc.)
  visible: boolean = false; // Controla si el mensaje es visible o no

  ngOnInit(): void { }

  show(): void {
    this.visible = true;
    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
      this.visible = false;
    }, 5000);
  }

  // Método para determinar el ícono basado en el tipo
  getIconClass(): string {
    switch (this.type) {
      case 'success':
        return 'bi bi-check-circle-fill'; // Ícono para éxito
      case 'warning':
        return 'bi bi-exclamation-triangle-fill'; // Ícono para advertencia
      case 'info':
        return 'bi bi-info-circle-fill'; // Ícono para información
      case 'danger':
        return 'bi bi-exclamation-octagon-fill'; // Ícono para errores
      default:
        return 'bi bi-info-circle-fill'; // Ícono predeterminado
    }
  }
}
