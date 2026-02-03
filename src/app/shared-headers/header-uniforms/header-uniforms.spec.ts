import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderUNIFORMS } from './header-uniforms';

describe('HeaderUNIFORMS', () => {
  let component: HeaderUNIFORMS;
  let fixture: ComponentFixture<HeaderUNIFORMS>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderUNIFORMS]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderUNIFORMS);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
