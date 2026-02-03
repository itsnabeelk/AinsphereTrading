import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UNIFORMSFooter } from './uniforms-footer';

describe('UNIFORMSFooter', () => {
  let component: UNIFORMSFooter;
  let fixture: ComponentFixture<UNIFORMSFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UNIFORMSFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UNIFORMSFooter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
