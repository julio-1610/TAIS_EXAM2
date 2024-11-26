import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product, ProductService } from '../../services/product-service/product.service';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-form',
  imports: [FormsModule, ConfirmationComponent, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent {
  @ViewChild('productConfirmation') confirmation!: ConfirmationComponent;

  @Output() productSaved = new EventEmitter<void>();

  product: Product = {
    id_producto: '',
    nombre: '',
    descripcion: '',
    cantidad: 0,
    precio: 0,
    categoria: ''
  };

  constructor(
    private productService: ProductService
  ) { }

  saveProduct() {
    this.productService.saveProduct(this.product).subscribe(
      (response) => {
        console.log('Producto guardado con éxito:', response);
        this.confirmation.message = '¡Producto guardado con éxito!';
        this.confirmation.type = 'success';
        this.confirmation.show();
        this.resetForm();
        this.productSaved.emit();
      },
      (error) => {
        console.error('Error al guardar el producto:', error);
        this.confirmation.message = 'Error al guardar el producto.';
        this.confirmation.type = 'danger';
        this.confirmation.show();
      }
    );
  }

  resetForm() {
    this.product = {
      id_producto: '',
      nombre: '',
      descripcion: '',
      cantidad: 0,
      precio: 0,
      categoria: ''
    };
  }
}
