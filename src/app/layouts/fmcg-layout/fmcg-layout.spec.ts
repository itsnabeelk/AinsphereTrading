import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FmcgLayout } from './fmcg-layout';

describe('FmcgLayout', () => {
  let component: FmcgLayout;
  let fixture: ComponentFixture<FmcgLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FmcgLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FmcgLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
