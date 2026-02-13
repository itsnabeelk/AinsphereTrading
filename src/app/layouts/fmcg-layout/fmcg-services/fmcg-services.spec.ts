import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FmcgServices } from './fmcg-services';

describe('FmcgServices', () => {
  let component: FmcgServices;
  let fixture: ComponentFixture<FmcgServices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FmcgServices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FmcgServices);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
