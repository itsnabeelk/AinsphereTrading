import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MepServices } from './mep-services';

describe('MepServices', () => {
  let component: MepServices;
  let fixture: ComponentFixture<MepServices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MepServices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MepServices);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
