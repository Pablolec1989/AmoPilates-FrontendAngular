import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarHorarioDialogComponent } from './editar-horario-dialog.component';

describe('EditarHorarioDialogComponent', () => {
  let component: EditarHorarioDialogComponent;
  let fixture: ComponentFixture<EditarHorarioDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarHorarioDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarHorarioDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
