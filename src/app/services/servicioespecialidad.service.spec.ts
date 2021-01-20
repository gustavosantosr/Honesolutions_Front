import { TestBed } from '@angular/core/testing';

import { ServicioespecialidadService } from './servicioespecialidad.service';

describe('ServicioespecialidadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServicioespecialidadService = TestBed.get(ServicioespecialidadService);
    expect(service).toBeTruthy();
  });
});
