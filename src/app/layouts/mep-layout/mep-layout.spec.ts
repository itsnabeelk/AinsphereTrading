import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MepLayout } from './mep-layout';

describe('MepLayout', () => {
  let component: MepLayout;
  let fixture: ComponentFixture<MepLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MepLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MepLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
