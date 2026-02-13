import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MepHome } from './mep-home';

describe('MepHome', () => {
  let component: MepHome;
  let fixture: ComponentFixture<MepHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MepHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MepHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
