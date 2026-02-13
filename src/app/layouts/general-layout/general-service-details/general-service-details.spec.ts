import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralServiceDetails } from './general-service-details';

describe('GeneralServiceDetails', () => {
  let component: GeneralServiceDetails;
  let fixture: ComponentFixture<GeneralServiceDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralServiceDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralServiceDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
