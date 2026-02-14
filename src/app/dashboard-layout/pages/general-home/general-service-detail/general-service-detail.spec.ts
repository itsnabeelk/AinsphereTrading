import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralServiceDetail } from './general-service-detail';

describe('GeneralServiceDetail', () => {
  let component: GeneralServiceDetail;
  let fixture: ComponentFixture<GeneralServiceDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralServiceDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralServiceDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
