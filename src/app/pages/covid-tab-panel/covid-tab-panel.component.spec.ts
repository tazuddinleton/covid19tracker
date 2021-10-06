import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CovidTabPanelComponent } from './covid-tab-panel.component';

describe('CovidMapComponent', () => {
  let component: CovidTabPanelComponent;
  let fixture: ComponentFixture<CovidTabPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CovidTabPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CovidTabPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
