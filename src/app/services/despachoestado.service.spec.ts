import { TestBed } from '@angular/core/testing';

import { DespachoestadoService } from './despachoestado.service';

describe('DespachoestadoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DespachoestadoService = TestBed.get(DespachoestadoService);
    expect(service).toBeTruthy();
  });
});
