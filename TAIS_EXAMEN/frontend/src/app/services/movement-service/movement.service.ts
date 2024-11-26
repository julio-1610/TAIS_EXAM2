import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Movement {
  id_movimiento: string;
  tipo_movimiento: string; // ENTRADA o SALIDA
  descripcion: string;
  id_producto: string;
  cantidad: number;
}
@Injectable({
  providedIn: 'root'
})
export class MovementService {
  private url = "https://pzxkp74tnk.execute-api.us-east-2.amazonaws.com/dev/api/movimientos/";

  constructor(
    private http: HttpClient
  ) { }

  getMovements(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  saveMovement(movement: Movement): Observable<any> {
    return this.http.post<any>(this.url, movement);
  }
}
