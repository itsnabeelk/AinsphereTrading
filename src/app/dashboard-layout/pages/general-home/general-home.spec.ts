import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralHome } from './general-home';

describe('GeneralHome', () => {
  let component: GeneralHome;
  let fixture: ComponentFixture<GeneralHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
