import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniformHome } from './uniform-home';

describe('UniformHome', () => {
  let component: UniformHome;
  let fixture: ComponentFixture<UniformHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniformHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniformHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
