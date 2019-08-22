import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MnistClassifierComponent } from './mnist-classifier.component';

describe('MnistClassifierComponent', () => {
  let component: MnistClassifierComponent;
  let fixture: ComponentFixture<MnistClassifierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MnistClassifierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MnistClassifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
