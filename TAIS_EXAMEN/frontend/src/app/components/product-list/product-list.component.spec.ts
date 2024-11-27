import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product-service/product.service';
import { ProductStateService } from '../../services/product-state/product-state.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockProductStateService: jasmine.SpyObj<ProductStateService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductService', ['getProducts']);
    mockProductStateService = jasmine.createSpyObj('ProductStateService', ['setProducto']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: ProductStateService, useValue: mockProductStateService },
        { provide: Router, useValue: mockRouter },
      ],
      imports: [
        ProductListComponent,
        FormsModule,  // Si utiliza formularios
        HttpClientModule,  // Si realiza peticiones HTTP
        RouterTestingModule // Si utiliza navegación
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on initialization', () => {
    const mockProducts = [
      { id_producto: '1', nombre: 'Producto 1', descripcion: "Descripcion de Producto 1", categoria: 'Categoría 1', precio: 100, cantidad: 10 },
      { id_producto: '2', nombre: 'Producto 2', descripcion: "Descripcion de Producto 2", categoria: 'Categoría 2', precio: 200, cantidad: 20 },
    ];
    mockProductService.getProducts.and.returnValue(of(mockProducts));

    component.ngOnInit();

    expect(mockProductService.getProducts).toHaveBeenCalled();
    expect(component.productos).toEqual(mockProducts);
    expect(component.productosFiltrados).toEqual(mockProducts);
  });

  it('should navigate to product details on verDetalle', () => {
    const mockProduct = { id_producto: '1', nombre: 'Producto 1', descripcion: "Descripción del Producto 1", categoria: 'Categoría 1', precio: 100, cantidad: 10 };

    component.verDetalle(mockProduct);

    expect(mockProductStateService.setProducto).toHaveBeenCalledWith(mockProduct);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/product-view']);
  });

  it('should filter products correctly', () => {
    component.productos = [
      { id_producto: '1', nombre: 'Producto 1', descripcion: "Descripcion de Producto 1", categoria: 'Alimentos', precio: 100, cantidad: 10 },
      { id_producto: '2', nombre: 'Producto 2', descripcion: "Descripcion de Producto 2", categoria: 'Electrónica', precio: 200, cantidad: 20 },
    ];

    component.categoriaFiltro = 'Alimentos';
    component.filtrarProductos();

    expect(component.productosFiltrados).toEqual([
      { id_producto: '1', nombre: 'Producto 1', descripcion: "Descripcion de Producto 1", categoria: 'Alimentos', precio: 100, cantidad: 10 },
    ]);
  });
});
