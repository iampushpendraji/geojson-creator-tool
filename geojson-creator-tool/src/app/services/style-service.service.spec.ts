import { TestBed } from '@angular/core/testing';

import { StyleServiceService } from './style-service.service';

describe('StyleServiceService', () => {
  let service: StyleServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StyleServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
