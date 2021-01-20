import { TestBed } from '@angular/core/testing';

import { EspecialidadtipoService } from './especialidadtipo.service';

describe('EspecialidadtipoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EspecialidadtipoService = TestBed.get(EspecialidadtipoService);
    expect(service).toBeTruthy();
  });
});
