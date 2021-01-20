import { TestBed } from '@angular/core/testing';

import { ServiciotipoService } from './serviciotipo.service';

describe('ServiciotipoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServiciotipoService = TestBed.get(ServiciotipoService);
    expect(service).toBeTruthy();
  });
});
