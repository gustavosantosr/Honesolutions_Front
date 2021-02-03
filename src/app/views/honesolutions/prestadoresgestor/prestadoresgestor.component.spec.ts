import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestadoresgestorComponent } from './prestadoresgestor.component';

describe('PrestadoresgestorComponent', () => {
  let component: PrestadoresgestorComponent;
  let fixture: ComponentFixture<PrestadoresgestorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrestadoresgestorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrestadoresgestorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
