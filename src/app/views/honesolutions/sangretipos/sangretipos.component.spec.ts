import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SangretiposComponent } from './sangretipos.component';

describe('SangretiposComponent', () => {
  let component: SangretiposComponent;
  let fixture: ComponentFixture<SangretiposComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SangretiposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SangretiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
