import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardprestadorComponent } from './wizardprestador.component';

describe('WizardprestadorComponent', () => {
  let component: WizardprestadorComponent;
  let fixture: ComponentFixture<WizardprestadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WizardprestadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardprestadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
