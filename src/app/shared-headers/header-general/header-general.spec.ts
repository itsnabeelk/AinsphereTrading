import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderGeneral } from './header-general';

describe('HeaderGeneral', () => {
  let component: HeaderGeneral;
  let fixture: ComponentFixture<HeaderGeneral>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderGeneral]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderGeneral);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
