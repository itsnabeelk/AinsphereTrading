import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderFMCG } from './header-fmcg';

describe('HeaderFMCG', () => {
  let component: HeaderFMCG;
  let fixture: ComponentFixture<HeaderFMCG>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderFMCG]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderFMCG);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
