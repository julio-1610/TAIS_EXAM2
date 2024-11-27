import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ProductFormComponent } from './product-form.component';
import { ProductService } from '../../services/product-service/product.service';
import { ConfirmationComponent } from '../confirmation/confirmation.component';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let confirmationFixture: ComponentFixture<ConfirmationComponent>;
  let confirmationComponent: ConfirmationComponent;

  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductService', ['getProducts', 'saveProduct']);

    // Inicializar correctamente la propiedad 'product' dentro del beforeEach
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ProductFormComponent,
        ConfirmationComponent
      ],
      providers: [{
        provide: ProductService,
        useValue: mockProductService
      }],
    }).compileComponents();

    // Crear el fixture y la instancia del ProductFormComponent
    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;

    // Asegúrate de que component.product esté inicializado correctamente
    component.product = {
      id_producto: '',
      nombre: '',
      descripcion: '',
      cantidad: 0,
      precio: 0,
      categoria: ''
    };

    // Crear el fixture y la instancia del ConfirmationComponent
    confirmationFixture = TestBed.createComponent(ConfirmationComponent);
    confirmationComponent = confirmationFixture.componentInstance;

    // Conectar el ConfirmationComponent con el ProductFormComponent
    component.confirmation = confirmationComponent;

    // Configurar las respuestas del mock del servicio
    mockProductService.getProducts.and.returnValue(of([]));
    mockProductService.saveProduct.and.returnValue(of({}));

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load existing product names on initialization', () => {
    const mockProducts = [
      { id_producto: '1', nombre: 'Producto 1', descripcion: 'Descripción del Producto 1', categoria: 'Categoría 1', precio: 100, cantidad: 10 },
    ];
    mockProductService.getProducts.and.returnValue(of(mockProducts));

    component.ngOnInit();

    expect(mockProductService.getProducts).toHaveBeenCalled();
    expect(component.existingNames).toEqual(['producto 1']);
  });

  it('should validate unique product name', () => {
    component.existingNames = ['producto 1'];

    component.product.nombre = 'Producto 2';
    expect(component.validateName()).toBeTrue();

    component.product.nombre = 'Producto 1';
    expect(component.validateName()).toBeFalse();
  });

  it('should reset the form after saving', () => {
    component.resetForm();
    expect(component.product).toEqual({
      id_producto: '',
      nombre: '',
      descripcion: '',
      categoria: '',
      precio: 0,
      cantidad: 0,
    });
  });
});
