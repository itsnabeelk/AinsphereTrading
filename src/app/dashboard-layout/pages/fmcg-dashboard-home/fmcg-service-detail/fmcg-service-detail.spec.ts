import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FmcgServiceDetail } from './fmcg-service-detail';

describe('FmcgServiceDetail', () => {
  let component: FmcgServiceDetail;
  let fixture: ComponentFixture<FmcgServiceDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FmcgServiceDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FmcgServiceDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
