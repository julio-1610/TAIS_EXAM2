import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovementFormComponent } from './movement-form.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovementService } from '../../services/movement-service/movement.service';
import { ProductService } from '../../services/product-service/product.service';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { of, throwError } from 'rxjs';

describe('MovementFormComponent', () => {
  let component: MovementFormComponent;
  let fixture: ComponentFixture<MovementFormComponent>;
  let movementServiceMock: jasmine.SpyObj<MovementService>;
  let productServiceMock: jasmine.SpyObj<ProductService>;
  let confirmationComponentMock: jasmine.SpyObj<ConfirmationComponent>;

  beforeEach(() => {
    movementServiceMock = jasmine.createSpyObj('MovementService', ['saveMovement']);
    productServiceMock = jasmine.createSpyObj('ProductService', ['getProductById']);
    confirmationComponentMock = jasmine.createSpyObj('ConfirmationComponent', ['show']);

    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, MovementFormComponent, ConfirmationComponent],
      declarations: [],
      providers: [
        { provide: MovementService, useValue: movementServiceMock },
        { provide: ProductService, useValue: productServiceMock },
        { provide: ConfirmationComponent, useValue: confirmationComponentMock },
      ]
    });

    fixture = TestBed.createComponent(MovementFormComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call obtenerCantidadDisponible when idProducto changes', () => {
    const spy = spyOn(component, 'obtenerCantidadDisponible');
    component.idProducto = '123';
    component.ngOnChanges({
      idProducto: { currentValue: '123', previousValue: null, firstChange: true, isFirstChange: () => true }
    });
    expect(spy).toHaveBeenCalled();
  });

  it('should update cantidadDisponible from ProductService', () => {
    productServiceMock.getProductById.and.returnValue(of({ cantidad: 100 }));
    component.idProducto = '123';
    component.obtenerCantidadDisponible();
    fixture.detectChanges();
    expect(component.cantidadDisponible).toBe(100);
  });
});
