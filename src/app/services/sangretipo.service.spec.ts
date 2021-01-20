import { TestBed } from '@angular/core/testing';

import { SangretipoService } from './sangretipo.service';

describe('SangretipoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SangretipoService = TestBed.get(SangretipoService);
    expect(service).toBeTruthy();
  });
});
