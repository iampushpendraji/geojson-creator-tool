import { TestBed } from '@angular/core/testing';

import { MapServiceService } from './map-service.service';

describe('MapServiceService', () => {
  let service: MapServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
