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

  existingNames: string[] = [];

  constructor(
    private productService: ProductService
  ) { }

  ngOnInit() {
    // Obtener los IDs de productos existentes para la validación
    this.productService.getProducts().subscribe((data) => {
      this.existingNames = data.map((prod) => prod.nombre.toLowerCase()); // Convertir a minúsculas para hacer la comparación insensible a mayúsculas
    });
  }

  validateName(): boolean {
    return !this.existingNames.includes(this.product.nombre.toLowerCase()); // Compara el nombre convertido a minúsculas
  }

  // Función para validar si la cantidad es un número entero
  esEntero(numero: number): boolean {
    return Number.isInteger(numero);
  }

  saveProduct() {
    if (!this.validateName()) {
      this.confirmation.message = 'El nombre del producto ya existe.';
      this.confirmation.type = 'danger';
      this.confirmation.show();
      return;
    }

    // Verificar que los campos requeridos sean válidos
    if (!this.product.nombre || !this.product.precio || !this.product.cantidad || !this.product.categoria || !this.product.descripcion) {
      this.confirmation.message = 'Por favor, complete todos los campos obligatorios.';
      this.confirmation.type = 'danger';
      this.confirmation.show();
      return;
    }

    if (!this.esEntero(this.product.cantidad)) {
      this.confirmation.message = 'La cantidad debe ser un número entero.';
      this.confirmation.type = 'danger';
      this.confirmation.show();
      return;
    }

    if (this.product.cantidad < 0 || this.product.precio < 0) {
      this.confirmation.message = 'La cantidad y el precio no pueden ser negativos.';
      this.confirmation.type = 'danger';
      this.confirmation.show();
      return;
    }

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
