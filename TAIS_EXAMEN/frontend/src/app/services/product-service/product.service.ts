import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Product {
  id_producto: string;
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
  private apiUrl = 'https://ohxkv3ewre.execute-api.us-east-2.amazonaws.com/dev/api/productos/';

  constructor(
    private http: HttpClient
  ) { }

  // Método para obtener todos los productos
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getProductById(id: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + id + "/");
  }

  saveProduct(product: Product): Observable<any> {
    return this.http.post<any>(this.apiUrl, product);
  }
}