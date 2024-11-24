import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  imports: [CommonModule]
})
export class ProductListComponent {
  productos = [
    { codigo: 'P001', nombre: 'Producto 1', categoria: 'Electrónica', precio: 120 },
    { codigo: 'P002', nombre: 'Producto 2', categoria: 'Ropa', precio: 50 },
    { codigo: 'P003', nombre: 'Producto 3', categoria: 'Alimentos', precio: 30 },
  ];

  constructor(private router: Router) { }

  ngOnInit() {
    console.log('Componente de lista de productos cargado');
    this.productos = [
      { codigo: 'P001', nombre: 'Producto 1', categoria: 'Electrónica', precio: 120 },
      { codigo: 'P002', nombre: 'Producto 2', categoria: 'Ropa', precio: 50 },
      { codigo: 'P003', nombre: 'Producto 3', categoria: 'Alimentos', precio: 30 },
    ];
  }

  verDetalle(producto: any) {
    this.router.navigate(['/product-view', producto.codigo]);
    console.log('Detalle del producto:', producto);
  }

  eliminarProducto(codigo: string) {
    this.productos = this.productos.filter((p) => p.codigo !== codigo);
    console.log('Producto eliminado:', codigo);
  }
}