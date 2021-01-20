import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentorequeridosComponent } from './documentorequeridos.component';

describe('DocumentorequeridosComponent', () => {
  let component: DocumentorequeridosComponent;
  let fixture: ComponentFixture<DocumentorequeridosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentorequeridosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentorequeridosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
