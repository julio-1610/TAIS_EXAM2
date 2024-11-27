import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { ConfirmationComponent } from './confirmation.component';
import { By } from '@angular/platform-browser';

describe('ConfirmationComponent', () => {
  let component: ConfirmationComponent;
  let fixture: ComponentFixture<ConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the message and hide it after 5 seconds', fakeAsync(() => {
    component.message = 'Test confirmation message';
    component.type = 'success';
    component.show();
    fixture.detectChanges();

    const alertElement = fixture.debugElement.query(By.css('.alert'));
    expect(alertElement).toBeTruthy();
    expect(alertElement.nativeElement.textContent).toContain('Test confirmation message');

    // Simula 5 segundos
    tick(5000);
    fixture.detectChanges();

    expect(component.visible).toBeFalse();
    flush(); // Limpia cualquier tarea pendiente en el temporizador
  }));

  it('should return the correct icon class for "success"', () => {
    component.type = 'success';
    expect(component.getIconClass()).toBe('bi bi-check-circle-fill');
  });

  it('should return the correct icon class for "danger"', () => {
    component.type = 'danger';
    expect(component.getIconClass()).toBe('bi bi-exclamation-octagon-fill');
  });

  it('should use the default icon class for an unknown type', () => {
    component.type = 'unknown';
    expect(component.getIconClass()).toBe('bi bi-info-circle-fill');
  });
});
