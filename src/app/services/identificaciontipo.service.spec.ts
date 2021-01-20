import { TestBed } from '@angular/core/testing';

import { IdentificaciontipoService } from './identificaciontipo.service';

describe('IdentificaciontipoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IdentificaciontipoService = TestBed.get(IdentificaciontipoService);
    expect(service).toBeTruthy();
  });
});
