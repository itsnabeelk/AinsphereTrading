import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MepServiceDetail } from './mep-service-detail';

describe('MepServiceDetail', () => {
  let component: MepServiceDetail;
  let fixture: ComponentFixture<MepServiceDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MepServiceDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MepServiceDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
