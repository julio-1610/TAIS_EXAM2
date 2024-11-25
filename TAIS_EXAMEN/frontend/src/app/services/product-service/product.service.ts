import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Product {
  id_producto: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://2vxfz35801.execute-api.us-east-2.amazonaws.com/dev/api/productos/';

  constructor(
    private http: HttpClient
  ) { }

  // Método para obtener todos los productos
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  saveProduct(product: Product): Observable<any> {
    return this.http.post<any>(this.apiUrl, product);
  }
}