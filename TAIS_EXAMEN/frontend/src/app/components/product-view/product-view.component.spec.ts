import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductViewComponent } from './product-view.component';
import { MovementService } from '../../services/movement-service/movement.service';
import { Product, ProductService } from '../../services/product-service/product.service';
import { ProductStateService } from '../../services/product-state/product-state.service';
import { Router } from '@angular/router';
import { catchError, of, throwError } from 'rxjs';
import { Movement } from '../../services/movement-service/movement.service';
import { CommonModule } from '@angular/common';
import { MovementFormComponent } from '../movement-form/movement-form.component';

describe('ProductViewComponent', () => {
  let component: ProductViewComponent;
  let fixture: ComponentFixture<ProductViewComponent>;
  let movementServiceMock: jasmine.SpyObj<MovementService>;
  let productServiceMock: jasmine.SpyObj<ProductService>;
  let productStateServiceMock: jasmine.SpyObj<ProductStateService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    movementServiceMock = jasmine.createSpyObj('MovementService', ['getMovements']);
    productServiceMock = jasmine.createSpyObj('ProductService', ['getProductById']);
    productStateServiceMock = jasmine.createSpyObj('ProductStateService', ['getProducto']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [CommonModule, ProductViewComponent, MovementFormComponent],
      providers: [
        { provide: MovementService, useValue: movementServiceMock },
        { provide: ProductService, useValue: productServiceMock },
        { provide: ProductStateService, useValue: productStateServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    fixture = TestBed.createComponent(ProductViewComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to product-list if no product is found', () => {
    productStateServiceMock.getProducto.and.returnValue(null);
    component.ngOnInit();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/product-list']);
  });
});