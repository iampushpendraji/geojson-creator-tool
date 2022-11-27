import { TestBed } from '@angular/core/testing';

import { GeocoderServiceService } from './geocoder-service.service';

describe('GeocoderServiceService', () => {
  let service: GeocoderServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeocoderServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
