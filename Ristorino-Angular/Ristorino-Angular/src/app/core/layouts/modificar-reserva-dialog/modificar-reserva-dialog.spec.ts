import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarReservaDialog } from './modificar-reserva-dialog';

describe('ModificarReservaDialog', () => {
  let component: ModificarReservaDialog;
  let fixture: ComponentFixture<ModificarReservaDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificarReservaDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarReservaDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
