import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralServices } from './general-services';

describe('GeneralServices', () => {
  let component: GeneralServices;
  let fixture: ComponentFixture<GeneralServices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralServices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralServices);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
