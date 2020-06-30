import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioModal } from './formulario-modal.component';

describe('FormularioComponent', () => {
  let component: FormularioModal;
  let fixture: ComponentFixture<FormularioModal>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioModal ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
