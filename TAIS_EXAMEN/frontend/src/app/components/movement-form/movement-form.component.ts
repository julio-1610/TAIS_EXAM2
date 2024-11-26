import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Movement, MovementService } from '../../services/movement-service/movement.service';

@Component({
  selector: 'app-movement-form',
  templateUrl: './movement-form.component.html',
  styleUrls: ['./movement-form.component.css'],
  imports: [CommonModule, FormsModule]
})
export class MovementFormComponent {
  @Input() idProducto!: string; // ID del producto al que se asocia el movimiento
  @Output() movementSaved = new EventEmitter<void>(); // Emisor para notificar al padre que se guardó un movimiento
  movimiento: Movement = {
    id_movimiento: 1600, // Será generado automáticamente en el backend
    tipo_movimiento: '',
    descripcion: '',
    id_producto: this.idProducto,
    cantidad: 0
  };

  constructor(private movementService: MovementService) { }

  ngOnInit() {
    this.idProducto = this.idProducto || '';
    console.log('ID del producto:', this.idProducto);
    this.movimiento.id_producto = this.idProducto;
  }

  guardarMovimiento() {
    console.log('Guardando movimiento:', this.movimiento);
    this.movementService.saveMovement(this.movimiento).subscribe(
      (response) => {
        alert('Movimiento guardado exitosamente.');
        this.movementSaved.emit(); // Notifica al componente padre que se guardó el movimiento
      },
      (error) => {

        console.error('Error al guardar el movimiento:', error);
        alert('Error al guardar el movimiento.');
      }
    );
  }
}
