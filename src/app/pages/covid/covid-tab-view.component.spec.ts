import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CovidTabViewComponent } from './covid-tab-view.component';

describe('CovidComponent', () => {
  let component: CovidTabViewComponent;
  let fixture: ComponentFixture<CovidTabViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CovidTabViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CovidTabViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
