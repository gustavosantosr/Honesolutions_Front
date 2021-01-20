import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestadorplanesComponent } from './prestadorplanes.component';

describe('PrestadorplanesComponent', () => {
  let component: PrestadorplanesComponent;
  let fixture: ComponentFixture<PrestadorplanesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrestadorplanesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrestadorplanesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
