import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniformServiceDetails } from './uniform-service-details';

describe('UniformServiceDetails', () => {
  let component: UniformServiceDetails;
  let fixture: ComponentFixture<UniformServiceDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniformServiceDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniformServiceDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
