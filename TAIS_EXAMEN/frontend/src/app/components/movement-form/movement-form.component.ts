import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product-service/product.service';
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

  cantidadDisponible: number = 0; // Variable que mantendrá la cantidad disponible del producto

  constructor(
    private movementService: MovementService,
    private productService: ProductService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idProducto'] && changes['idProducto'].currentValue) {
      this.movimiento.id_producto = this.idProducto;
      this.obtenerCantidadDisponible(); // Actualiza la cantidad disponible cuando el ID del producto cambie
    }
  }

  obtenerCantidadDisponible(): void {
    this.productService.getProductById(this.movimiento.id_producto).subscribe(
      (producto) => {
        this.cantidadDisponible = producto.cantidad; // Asignamos la cantidad disponible del producto
        console.log('Cantidad disponible actualizada:', this.cantidadDisponible);
      },
      (error) => {
        console.error('Error al obtener la cantidad disponible:', error);
      }
    );
  }

  // Función para validar si la cantidad es un número entero
  esEntero(numero: number): boolean {
    return Number.isInteger(numero);
  }

  guardarMovimiento() {
    // Verifica si la cantidad es un número entero y mayor a 0
    if (!this.movimiento.tipo_movimiento || this.movimiento.cantidad <= 0 || !this.esEntero(this.movimiento.cantidad)) {
      this.confirmation.message = 'La cantidad debe ser un número entero mayor a 0.';
      this.confirmation.type = 'danger';
      this.confirmation.show();
      return;
    }

    // Validación para salida y cantidad disponible
    if (this.movimiento.tipo_movimiento === 'salida' && this.movimiento.cantidad > this.cantidadDisponible) {
      this.confirmation.message = 'No puedes crear una salida mayor a la cantidad disponible.';
      this.confirmation.type = 'danger';
      this.confirmation.show();
      return;
    }

    console.log('Guardando movimiento:', this.movimiento);
    this.movementService.saveMovement(this.movimiento).subscribe(
      () => {
        console.log('Movimiento guardado con éxito.', this.movimiento);
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

  formularioValido(): boolean {
    // Verifica que los campos requeridos estén completos, y que la cantidad sea mayor que 0 y válida para el tipo de movimiento
    return !!this.movimiento.tipo_movimiento && this.movimiento.cantidad > 0 &&
      (this.movimiento.tipo_movimiento === 'entrada' || (this.movimiento.tipo_movimiento === 'salida' && this.movimiento.cantidad <= this.cantidadDisponible));
  }
}
