import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconListDialogComponent } from './icon-list-dialog.component';

describe('IconListDialogComponent', () => {
  let component: IconListDialogComponent;
  let fixture: ComponentFixture<IconListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IconListDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
