import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FmcgServiceDetails } from './fmcg-service-details';

describe('FmcgServiceDetails', () => {
  let component: FmcgServiceDetails;
  let fixture: ComponentFixture<FmcgServiceDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FmcgServiceDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FmcgServiceDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
