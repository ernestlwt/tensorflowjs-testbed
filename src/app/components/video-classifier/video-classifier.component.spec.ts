import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoClassifierComponent } from './video-classifier.component';

describe('VideoClassifierComponent', () => {
  let component: VideoClassifierComponent;
  let fixture: ComponentFixture<VideoClassifierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoClassifierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoClassifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
