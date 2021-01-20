import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoTiposComponent } from './documentotipos.component';

describe('DocumentotiposComponent', () => {
  let component: DocumentoTiposComponent;
  let fixture: ComponentFixture<DocumentoTiposComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentoTiposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoTiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
