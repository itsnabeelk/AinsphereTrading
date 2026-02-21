import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniformDashboardHome } from './uniform-dashboard-home';

describe('UniformDashboardHome', () => {
  let component: UniformDashboardHome;
  let fixture: ComponentFixture<UniformDashboardHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniformDashboardHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniformDashboardHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
