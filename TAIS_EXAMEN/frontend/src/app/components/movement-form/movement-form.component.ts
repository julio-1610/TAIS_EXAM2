import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Movement, MovementService } from '../../services/movement-service/movement.service';
import { ConfirmationComponent } from '../confirmation/confirmation.component';

@Component({
  selector: 'app-movement-form',
  templateUrl: './movement-form.component.html',
  styleUrls: ['./movement-form.component.css'],
  imports: [CommonModule, FormsModule, ConfirmationComponent]
})
export class MovementFormComponent implements OnChanges {
  @ViewChild('movementConfirmation') confirmation!: ConfirmationComponent;
  @Input() idProducto!: string; // ID del producto al que se asocia el movimiento
  @Output() movementSaved = new EventEmitter<void>(); // Emisor para notificar al padre que se guardó un movimiento
  movimiento: Movement = {
    id_movimiento: '', // Será generado automáticamente en el backend
    tipo_movimiento: '',
    descripcion: '',
    id_producto: '',
    cantidad: 0
  };

  constructor(private movementService: MovementService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idProducto'] && changes['idProducto'].currentValue) {
      this.movimiento.id_producto = this.idProducto;
      console.log('ID del producto asignado al formulario:', this.movimiento.id_producto);
    }
  }

  guardarMovimiento() {
    console.log('Guardando movimiento:', this.movimiento);
    this.movementService.saveMovement(this.movimiento).subscribe(
      () => {
        this.confirmation.message = '¡Movimiento guardado con éxito!';
        this.confirmation.type = 'success';
        this.confirmation.show();
        this.movementSaved.emit(); // Notifica al componente padre que se guardó el movimiento
      },
      (error) => {
        console.error('Error al guardar el movimiento:', error);
        this.confirmation.message = 'Error al guardar el movimiento.';
        this.confirmation.type = 'danger';
        this.confirmation.show();
      }
    );
  }
}
