import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralAbout } from './general-about';

describe('GeneralAbout', () => {
  let component: GeneralAbout;
  let fixture: ComponentFixture<GeneralAbout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralAbout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralAbout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
