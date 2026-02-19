import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MepDashboardHome } from './mep-dashboard-home';

describe('MepDashboardHome', () => {
  let component: MepDashboardHome;
  let fixture: ComponentFixture<MepDashboardHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MepDashboardHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MepDashboardHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
