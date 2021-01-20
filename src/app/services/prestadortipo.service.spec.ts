import { TestBed } from '@angular/core/testing';

import { PrestadortipoService } from './prestadortipo.service';

describe('PrestadortipoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrestadortipoService = TestBed.get(PrestadortipoService);
    expect(service).toBeTruthy();
  });
});
