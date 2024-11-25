import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Movement {
  id_movimiento: number;
  tipo_movimiento: string;
  descripcion: string;
  id_producto: number;
  cantidad: number;
}
@Injectable({
  providedIn: 'root'
})
export class MovementService {
  private url = "https://cxdw93tjxh.execute-api.us-east-2.amazonaws.com/dev/api/movimientos/";

  constructor(
    private http: HttpClient
  ) { }

  // Método para llamar todos los movimientos
  getMovements(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }
}
