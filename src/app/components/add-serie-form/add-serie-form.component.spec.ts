import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSerieFormComponent } from './add-serie-form.component';

describe('AddSerieFormComponent', () => {
  let component: AddSerieFormComponent;
  let fixture: ComponentFixture<AddSerieFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSerieFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSerieFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
