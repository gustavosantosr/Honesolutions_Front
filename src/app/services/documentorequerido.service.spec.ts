import { TestBed } from '@angular/core/testing';

import { DocumentorequeridoService } from './documentorequerido.service';

describe('DocumentorequeridoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DocumentorequeridoService = TestBed.get(DocumentorequeridoService);
    expect(service).toBeTruthy();
  });
});
