import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCareer } from './dashboard-career';

describe('DashboardCareer', () => {
  let component: DashboardCareer;
  let fixture: ComponentFixture<DashboardCareer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCareer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCareer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
