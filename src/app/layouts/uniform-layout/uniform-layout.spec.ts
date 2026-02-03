import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniformLayout } from './uniform-layout';

describe('UniformLayout', () => {
  let component: UniformLayout;
  let fixture: ComponentFixture<UniformLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniformLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniformLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
