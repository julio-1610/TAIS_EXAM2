import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MovementService, Movement } from './movement.service';

describe('MovementService', () => {
  let service: MovementService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MovementService]
    });
    service = TestBed.inject(MovementService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve movements via GET', () => {
    const mockMovements: Movement[] = [
      { id_movimiento: '1', tipo_movimiento: 'ENTRADA', descripcion: 'Test 1', id_producto: '101', cantidad: 10 },
      { id_movimiento: '2', tipo_movimiento: 'SALIDA', descripcion: 'Test 2', id_producto: '102', cantidad: 5 }
    ];

    service.getMovements().subscribe((movements) => {
      expect(movements.length).toBe(2);
      expect(movements).toEqual(mockMovements);
    });

    const req = httpMock.expectOne(service['url']);
    expect(req.request.method).toBe('GET');
    req.flush(mockMovements);
  });

  it('should save a movement via POST', () => {
    const newMovement: Movement = { id_movimiento: '3', tipo_movimiento: 'ENTRADA', descripcion: 'Test 3', id_producto: '103', cantidad: 15 };

    service.saveMovement(newMovement).subscribe((response) => {
      expect(response).toEqual(newMovement);
    });

    const req = httpMock.expectOne(service['url']);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newMovement);
    req.flush(newMovement);
  });
});
