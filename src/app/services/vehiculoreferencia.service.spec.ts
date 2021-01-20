import { TestBed } from '@angular/core/testing';

import { VehiculoreferenciaService } from './vehiculoreferencia.service';

describe('VehiculoreferenciaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VehiculoreferenciaService = TestBed.get(VehiculoreferenciaService);
    expect(service).toBeTruthy();
  });
});
