import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MEPFooter } from './mep-footer';

describe('MEPFooter', () => {
  let component: MEPFooter;
  let fixture: ComponentFixture<MEPFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MEPFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MEPFooter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
