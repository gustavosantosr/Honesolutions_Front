import { TestBed } from '@angular/core/testing';

import { VehiculomarcaService } from './vehiculomarca.service';

describe('VehiculomarcaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VehiculomarcaService = TestBed.get(VehiculomarcaService);
    expect(service).toBeTruthy();
  });
});
