import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FmcgDashboardHome } from './fmcg-dashboard-home';

describe('FmcgDashboardHome', () => {
  let component: FmcgDashboardHome;
  let fixture: ComponentFixture<FmcgDashboardHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FmcgDashboardHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FmcgDashboardHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
