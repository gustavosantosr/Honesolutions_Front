import { TestBed } from '@angular/core/testing';

import { DespachoService } from './despacho.service';

describe('DespachoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DespachoService = TestBed.get(DespachoService);
    expect(service).toBeTruthy();
  });
});
