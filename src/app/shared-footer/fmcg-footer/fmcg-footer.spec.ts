import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FMCGFooter } from './fmcg-footer';

describe('FMCGFooter', () => {
  let component: FMCGFooter;
  let fixture: ComponentFixture<FMCGFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FMCGFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FMCGFooter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
