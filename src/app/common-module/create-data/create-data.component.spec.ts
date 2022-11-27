import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDataComponent } from './create-data.component';

describe('CreateDataComponent', () => {
  let component: CreateDataComponent;
  let fixture: ComponentFixture<CreateDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
