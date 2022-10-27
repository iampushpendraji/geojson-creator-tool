import { TestBed } from '@angular/core/testing';

import { IdentityFeatureServiceService } from './identity-feature-service.service';

describe('IdentityFeatureServiceService', () => {
  let service: IdentityFeatureServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdentityFeatureServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
