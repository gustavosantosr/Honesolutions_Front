import { TestBed } from '@angular/core/testing';

import { ConductorService } from './conductor.service';

describe('ConductorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConductorService = TestBed.get(ConductorService);
    expect(service).toBeTruthy();
  });
});
