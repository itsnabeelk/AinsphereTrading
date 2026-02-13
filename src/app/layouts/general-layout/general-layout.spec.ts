import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralLayout } from './general-layout';

describe('GeneralLayout', () => {
  let component: GeneralLayout;
  let fixture: ComponentFixture<GeneralLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
