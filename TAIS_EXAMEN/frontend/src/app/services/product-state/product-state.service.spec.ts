import { TestBed } from '@angular/core/testing';
import { ProductStateService } from './product-state.service';
import { Product } from '../product-service/product.service';

describe('ProductStateService', () => {
  let service: ProductStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductStateService]
    });
    service = TestBed.inject(ProductStateService);
  });

  it('should set and get a product', () => {
    const mockProduct: Product = { id_producto: '1', nombre: 'Product 1', descripcion: 'Desc 1', categoria: 'Cat 1', precio: 100, cantidad: 10 };

    service.setProducto(mockProduct);
    const retrievedProduct = service.getProducto();
    expect(retrievedProduct).toEqual(mockProduct);
  });

  it('should clear a product', () => {
    const mockProduct: Product = { id_producto: '1', nombre: 'Product 1', descripcion: 'Desc 1', categoria: 'Cat 1', precio: 100, cantidad: 10 };

    service.setProducto(mockProduct);
    service.clearProducto();
    const retrievedProduct = service.getProducto();
    expect(retrievedProduct).toBeNull();
  });
});