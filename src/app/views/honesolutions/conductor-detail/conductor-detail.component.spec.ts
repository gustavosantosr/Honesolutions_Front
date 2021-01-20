import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConductorDetailComponent } from './conductor-detail.component';

describe('ConductorDetailComponent', () => {
  let component: ConductorDetailComponent;
  let fixture: ComponentFixture<ConductorDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConductorDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConductorDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
