import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FmcgHome } from './fmcg-home';

describe('FmcgHome', () => {
  let component: FmcgHome;
  let fixture: ComponentFixture<FmcgHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FmcgHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FmcgHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
