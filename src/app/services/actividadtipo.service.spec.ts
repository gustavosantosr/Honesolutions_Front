import { TestBed } from '@angular/core/testing';

import { ActividadtipoService } from './actividadtipo.service';

describe('ActividadtipoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActividadtipoService = TestBed.get(ActividadtipoService);
    expect(service).toBeTruthy();
  });
});
