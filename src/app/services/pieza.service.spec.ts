import { TestBed } from '@angular/core/testing';

import { PiezaService } from './pieza.service';

describe('PiezaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PiezaService = TestBed.get(PiezaService);
    expect(service).toBeTruthy();
  });
});
