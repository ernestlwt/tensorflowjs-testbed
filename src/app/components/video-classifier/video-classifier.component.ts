import { Component, OnInit, AfterViewInit, ElementRef, Input, ViewChild } from '@angular/core';

import * as cocossd from '@tensorflow-models/coco-ssd';
import { Prediction } from '../../prediction';

@Component({
  selector: 'app-video-classifier',
  templateUrl: './video-classifier.component.html',
  styleUrls: ['./video-classifier.component.css']
})
export class VideoClassifierComponent implements OnInit {
  @ViewChild('inVideo', { static: false }) inVideoER: ElementRef;
  @ViewChild('outCanvas', { static: false }) outCanvasER: ElementRef;
  private inVideo: HTMLVideoElement;
  private outCtx: CanvasRenderingContext2D;

  @Input() width = 500;
  @Input() height = 350;

  model: any;
  predictions: Prediction[];

  constructor() {

  }

  async ngOnInit() {
    this.model = await cocossd.load();
  }

  ngAfterViewInit() {
    this.inVideo = this.inVideoER.nativeElement;
    this.outCtx = this.outCanvasER.nativeElement.getContext('2d');

    this.inVideo.width = this.width;
    this.inVideo.height = this.height;

    this.outCanvasER.nativeElement.width = this.width;
    this.outCanvasER.nativeElement.height = this.height;
  }

  fileChanged(event) {
    if(event.target.files && event.target.files.length) {
      var url = URL.createObjectURL(event.target.files[0]);
      this.inVideo.src = url;
      this.detectFrame();
    }
  }

  async detectFrame() {
    this.predictions = await this.model.detect(this.inVideo);
    this.drawResultOnCanvas();
    // just to note, this is not recursion it creates something like a callback
    // event(which is requestAnimationFrame) which executes this.detectframe
    // when the frame is obtained
    requestAnimationFrame(() => {
      this.detectFrame();
    });
  }

  drawResultOnCanvas() {
    // repaint background
    // (in the case where bounding box exceed video size but not canvas size)
    this.outCtx.fillStyle = "white";
    this.outCtx.fillRect(0, 0, this.width, this.height);
    // Find largest measurement for video
    var wrh = this.inVideo.videoWidth / this.inVideo.videoHeight;
    var newWidth = this.width;
    var newHeight = newWidth / wrh;
    if (newHeight > this.height) {
        newHeight = this.height;
        newWidth = newHeight * wrh;
    }
    // draw and center video in canvas
    this.outCtx.drawImage(
      this.inVideo,
      (this.width - newWidth)/2,
      (this.height - newHeight)/2,
      newWidth,
      newHeight
    );

    // Fonts settings
    const font = "16px sans-serif";
    this.outCtx.font = font;
    this.outCtx.textBaseline = "top";

    // draw bounding box and label
    this.predictions.forEach(prediction => {

      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];

      // Bounding box
      this.outCtx.strokeStyle = "#00FFFF";
      this.outCtx.lineWidth = 2;
      this.outCtx.strokeRect(x, y, width, height);

      // Label background
      this.outCtx.fillStyle = "#00FFFF";
      const textWidth = this.outCtx.measureText(prediction.class).width;
      const textHeight = parseInt("16px sans-serif", 10); // base 10
      this.outCtx.fillRect(x, y, textWidth + 4, textHeight + 4);

      // Labels
      this.outCtx.fillStyle = "#000000";
      this.outCtx.fillText(prediction.class, x, y);
    });
  }

}
