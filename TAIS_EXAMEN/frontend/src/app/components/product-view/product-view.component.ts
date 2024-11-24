import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})
export class ProductViewComponent implements OnInit {
  producto: any;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    // Aquí puedes obtener los datos del producto usando las rutas o servicios.
    const codigo = this.route.snapshot.paramMap.get('codigo');
    // Simulación de datos
    this.producto = {
      codigo: codigo,
      nombre: 'Producto ' + codigo,
      descripcion: 'Descripción del producto ' + codigo,
      categoria: 'Categoría de ejemplo',
      precio: 100,
      cantidad: 10,
    };
  }

  volver() {
    this.router.navigate(['/product-list']);
  }
}
