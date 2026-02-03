import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderMEP } from './header-mep';

describe('HeaderMEP', () => {
  let component: HeaderMEP;
  let fixture: ComponentFixture<HeaderMEP>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderMEP]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderMEP);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
