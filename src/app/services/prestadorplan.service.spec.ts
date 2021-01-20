import { TestBed } from '@angular/core/testing';

import { PrestadorplanService } from './prestadorplan.service';

describe('PrestadorplanService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrestadorplanService = TestBed.get(PrestadorplanService);
    expect(service).toBeTruthy();
  });
});
