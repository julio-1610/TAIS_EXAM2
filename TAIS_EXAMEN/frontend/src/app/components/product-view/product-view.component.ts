import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product, ProductService } from '../../services/product-service/product.service';
import { ProductStateService } from '../../services/product-state/product-state.service';
import { Movement, MovementService } from '../../services/movement-service/movement.service';
import { CommonModule } from '@angular/common';
import { MovementFormComponent } from '../movement-form/movement-form.component';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css'],
  imports: [CommonModule, MovementFormComponent]
})
export class ProductViewComponent implements OnInit {
  producto: Product = {
    id_producto: '',
    descripcion: '',
    nombre: '',
    categoria: '',
    cantidad: 0,
    precio: 0
  };
  movements: Movement[] = [];

  constructor(
    private movementService: MovementService,
    private productService: ProductService,
    private productStateService: ProductStateService,
    private router: Router
  ) { }

  ngOnInit() {
    const producto = this.productStateService.getProducto();

    if (producto) {
      this.producto = producto;
      console.log('Producto recuperado del servicio:', this.producto);
      this.loadMovements(this.producto.id_producto);
    } else {
      console.error('No se encontró producto en el servicio.');
      this.router.navigate(['/product-list']); // Redirigir si no hay datos
    }
  }

  private loadMovements(productId: string) {
    this.movementService.getMovements().subscribe(
      (data) => {
        this.productService.getProductById(productId).subscribe(
          (product) => {
            this.producto = product;
            console.log('Producto cargado:', this.producto);
          },
          (error) => {
            console.error('Error al cargar producto:', error);
          }
        );

        this.movements = data.filter((movement) => movement.id_producto === productId);
        console.log('Movimientos cargados:', this.movements);
      },
      (error) => {
        console.error('Error al cargar movimientos:', error);
      }
    );
  }

  volver() {
    this.router.navigate(['/product-list']);
  }

  onMovementSaved() {
    if (this.producto.id_producto) {
      this.loadMovements(this.producto.id_producto); // Actualizar movimientos al guardar
    }
  }
}
