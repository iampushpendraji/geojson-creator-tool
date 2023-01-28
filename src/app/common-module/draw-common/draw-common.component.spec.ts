import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawCommonComponent } from './draw-common.component';

describe('DrawCommonComponent', () => {
  let component: DrawCommonComponent;
  let fixture: ComponentFixture<DrawCommonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawCommonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
