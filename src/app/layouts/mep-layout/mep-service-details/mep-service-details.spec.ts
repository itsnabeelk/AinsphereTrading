import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MepServiceDetails } from './mep-service-details';

describe('MepServiceDetails', () => {
  let component: MepServiceDetails;
  let fixture: ComponentFixture<MepServiceDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MepServiceDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MepServiceDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
