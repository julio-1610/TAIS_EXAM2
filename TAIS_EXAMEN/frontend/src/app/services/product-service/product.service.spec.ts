import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService, Product } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve products via GET', () => {
    const mockProducts: Product[] = [
      { id_producto: '1', nombre: 'Product 1', descripcion: 'Desc 1', categoria: 'Cat 1', precio: 100, cantidad: 10 },
      { id_producto: '2', nombre: 'Product 2', descripcion: 'Desc 2', categoria: 'Cat 2', precio: 200, cantidad: 20 }
    ];

    service.getProducts().subscribe((products) => {
      expect(products.length).toBe(2);
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should retrieve a product by ID via GET', () => {
    const mockProduct: Product = { id_producto: '1', nombre: 'Product 1', descripcion: 'Desc 1', categoria: 'Cat 1', precio: 100, cantidad: 10 };

    service.getProductById('1').subscribe((product) => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(service['apiUrl'] + '1/');
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should save a product via POST', () => {
    const newProduct: Product = { id_producto: '3', nombre: 'Product 3', descripcion: 'Desc 3', categoria: 'Cat 3', precio: 300, cantidad: 30 };

    service.saveProduct(newProduct).subscribe((response) => {
      expect(response).toEqual(newProduct);
    });

    const req = httpMock.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);
    req.flush(newProduct);
  });
});
