import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentityFeatureSideNavComponent } from './identity-feature-side-nav.component';

describe('IdentityFeatureSideNavComponent', () => {
  let component: IdentityFeatureSideNavComponent;
  let fixture: ComponentFixture<IdentityFeatureSideNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdentityFeatureSideNavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdentityFeatureSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
