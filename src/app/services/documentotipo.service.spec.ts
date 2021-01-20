import { TestBed } from '@angular/core/testing';

import { DocumentotipoService } from './documentotipo.service';

describe('DocumentotipoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DocumentotipoService = TestBed.get(DocumentotipoService);
    expect(service).toBeTruthy();
  });
});
