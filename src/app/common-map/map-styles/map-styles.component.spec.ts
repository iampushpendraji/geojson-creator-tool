import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapStylesComponent } from './map-styles.component';

describe('MapStylesComponent', () => {
  let component: MapStylesComponent;
  let fixture: ComponentFixture<MapStylesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapStylesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapStylesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
