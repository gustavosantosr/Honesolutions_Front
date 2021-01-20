import { TestBed } from '@angular/core/testing';

import { VehiculotipoService } from './vehiculotipo.service';

describe('VehiculotipoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VehiculotipoService = TestBed.get(VehiculotipoService);
    expect(service).toBeTruthy();
  });
});
