import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniformServices } from './uniform-services';

describe('UniformServices', () => {
  let component: UniformServices;
  let fixture: ComponentFixture<UniformServices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniformServices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniformServices);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
