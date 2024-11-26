import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product, ProductService } from '../../services/product-service/product.service';

@Component({
  selector: 'app-product-form',
  imports: [FormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent {
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
        alert('Producto guardado con éxito.');
        this.resetForm();
        this.productSaved.emit();
      },
      (error) => {
        console.error('Error al guardar el producto:', error);
        alert('Ocurrió un error al guardar el producto.');
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
