import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Product, ProductService } from '../../services/product-service/product.service';
import { ProductStateService } from '../../services/product-state/product-state.service';
import { ProductFormComponent } from '../product-form/product-form.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  imports: [CommonModule, ProductFormComponent, FormsModule]
})
export class ProductListComponent {
  productos: Product[] = [];
  productosFiltrados: Product[] = [];
  categoriaFiltro: string = '';
  cantidadFiltro: number | null = null;
  precioFiltro: number | null = null;

  constructor(
    private productService: ProductService,
    private productStateService: ProductStateService,
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
      this.productosFiltrados = [...this.productos]; // Mostrar todos inicialmente
      this.filtrarProductos(); // Aplicar filtros en caso de valores iniciales
    });
  }

  onProductSaved() {
    this.loadProducts();
  }

  verDetalle(producto: Product) {
    this.productStateService.setProducto(producto);
    this.router.navigate(['/product-view']);
  }

  filtrarProductos() {
    this.productosFiltrados = this.productos.filter((producto) => {
      const coincideCategoria =
        !this.categoriaFiltro || producto.categoria === this.categoriaFiltro;
      const coincideCantidad =
        this.cantidadFiltro === null || producto.cantidad >= this.cantidadFiltro;
      const coincidePrecio =
        this.precioFiltro === null || producto.precio <= this.precioFiltro;

      return coincideCategoria && coincideCantidad && coincidePrecio;
    });
  }
}