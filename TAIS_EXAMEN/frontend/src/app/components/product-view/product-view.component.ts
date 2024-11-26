import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductService } from '../../services/product-service/product.service';
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
    private route: ActivatedRoute,
    private movementService: MovementService,
    private productService: ProductService,
    private router: Router) { }

  ngOnInit() {
    const codigo = this.route.snapshot.paramMap.get('codigo');
    console.log('Código del producto:', codigo);

    // Obtener detalles del producto desde el servicio
    this.productService.getProductById(codigo!).subscribe((data) => {
      this.producto = data;
      console.log('Detalles del producto:', this.producto);
    });

    // Obtener movimientos asociados al producto
    this.movementService.getMovements().subscribe((data) => {
      this.movements = data;
      console.log('Movimientos del producto:', this.movements);
      this.movements = data.filter((movement) => movement.id_producto === codigo);
      console.log('Movimientos del producto:', this.movements);
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
    const codigo = this.producto?.id_producto;
    if (codigo) {
      this.movementService.getMovements().subscribe(
        (data) => {
          this.movements = data.filter((movement) => movement.id_producto === codigo);
          console.log('Movimientos actualizados:', this.movements);
        },
        (error) => {
          console.error('Error al actualizar movimientos:', error);
        }
      );
    }
  }

}
