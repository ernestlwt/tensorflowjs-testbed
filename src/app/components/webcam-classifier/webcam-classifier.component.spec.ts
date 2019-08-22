import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebcamClassifierComponent } from './webcam-classifier.component';

describe('WebcamClassifierComponent', () => {
  let component: WebcamClassifierComponent;
  let fixture: ComponentFixture<WebcamClassifierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebcamClassifierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebcamClassifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
