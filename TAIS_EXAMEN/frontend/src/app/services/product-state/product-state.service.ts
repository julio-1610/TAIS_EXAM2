import { Injectable } from '@angular/core';
import { Product } from '../product-service/product.service';

@Injectable({
  providedIn: 'root'
})
export class ProductStateService {
  private producto: Product | null = null;

  setProducto(producto: Product) {
    this.producto = producto;
  }

  getProducto(): Product | null {
    return this.producto;
  }

  clearProducto() {
    this.producto = null;
  }
}