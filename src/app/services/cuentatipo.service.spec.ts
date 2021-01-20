import { TestBed } from '@angular/core/testing';

import { CuentatipoService } from './cuentatipo.service';

describe('CuentatipoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CuentatipoService = TestBed.get(CuentatipoService);
    expect(service).toBeTruthy();
  });
});
