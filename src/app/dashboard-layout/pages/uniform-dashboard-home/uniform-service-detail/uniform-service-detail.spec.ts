import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniformServiceDetail } from './uniform-service-detail';

describe('UniformServiceDetail', () => {
  let component: UniformServiceDetail;
  let fixture: ComponentFixture<UniformServiceDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniformServiceDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniformServiceDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
