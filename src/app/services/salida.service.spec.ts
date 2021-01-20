import { TestBed } from '@angular/core/testing';

import { SalidaService } from './salida.service';

describe('SalidaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SalidaService = TestBed.get(SalidaService);
    expect(service).toBeTruthy();
  });
});
