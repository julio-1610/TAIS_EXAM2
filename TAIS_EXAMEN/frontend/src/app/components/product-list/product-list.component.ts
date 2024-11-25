import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product, ProductService } from '../../services/product-service/product.service';
import { Movement, MovementService } from '../../services/movement-service/movement.service';
import { ProductFormComponent } from '../product-form/product-form.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  imports: [CommonModule, ProductFormComponent]
})
export class ProductListComponent {
  productos: Product[] = [];

  constructor(
    private productService: ProductService,
    private movementService: MovementService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    console.log('Componente de lista de productos cargado');
    this.productService.getProducts().subscribe((data) => {
      console.log('Productos:', data);
      this.productos = data;
    });
    this.movementService.getMovements().subscribe((data) => {
      console.log('Movimientos: ', data);
    });
  }

  onProductSaved() {
    this.loadProducts();
  }

  verDetalle(producto: any) {
    this.router.navigate(['/product-view', producto.codigo]);
    console.log('Detalle del producto:', producto);
  }

  agregarProducto() {

  }

  eliminarProducto(id_producto: number) {
    this.productos = this.productos.filter((p) => p.id_producto !== id_producto);
    console.log('Producto eliminado:', id_producto);
  }
}