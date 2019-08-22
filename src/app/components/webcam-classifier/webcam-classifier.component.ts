import { Component, OnInit, AfterViewInit, ElementRef, Input, ViewChild } from '@angular/core';

import * as cocossd from '@tensorflow-models/coco-ssd';
import { Prediction } from '../../result-format/prediction';

@Component({
  selector: 'app-webcam-classifier',
  templateUrl: './webcam-classifier.component.html',
  styleUrls: ['./webcam-classifier.component.css']
})
export class WebcamClassifierComponent implements OnInit {
  @ViewChild('webcamVideo', { static: false }) webcamVideoER: ElementRef;
  @ViewChild('webcamCanvas', { static: false }) webcamCanvasER: ElementRef;
  private webcamVideo: HTMLVideoElement;
  private camCtx: CanvasRenderingContext2D;

  @Input() width = 500;
  @Input() height = 350;

  model: any;
  predictions: Prediction[];

  constructor() { }

  async ngOnInit() {
    this.model = await cocossd.load();
    this.webcamInit();
    this.detectFrame();
  }

  ngAfterViewInit() {
    this.camCtx = this.webcamCanvasER.nativeElement.getContext('2d');
    this.webcamVideo = this.webcamVideoER.nativeElement;

    this.webcamVideo.width = this.width;
    this.webcamVideo.height = this.height;

    this.webcamCanvasER.nativeElement.width = this.width;
    this.webcamCanvasER.nativeElement.height = this.height;
  }

  webcamInit() {
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {facingMode: "user",}
    }).then(stream => {
      this.webcamVideo.srcObject = stream;
      this.webcamVideo.onloadedmetadata = () => {
        this.webcamVideo.play();
      };
    });
  }

  async detectFrame() {
    this.predictions = await this.model.detect(this.webcamVideo);
    this.drawResultOnCanvas();
    // just to note, this is not recursion it creates something like a callback
    // event(which is requestAnimationFrame) which executes this.detectframe
    // when the frame is obtained
    requestAnimationFrame(() => {
      this.detectFrame();
    });
  }

  drawResultOnCanvas() {
    // draw video
    this.camCtx.drawImage(this.webcamVideo,0, 0,this.width, this.height);

    // Fonts settings
    const font = "16px sans-serif";
    this.camCtx.font = font;
    this.camCtx.textBaseline = "top";

    // draw bounding box and label
    this.predictions.forEach(prediction => {

      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];

      // Bounding box
      this.camCtx.strokeStyle = "#00FFFF";
      this.camCtx.lineWidth = 2;
      this.camCtx.strokeRect(x, y, width, height);

      // Label background
      this.camCtx.fillStyle = "#00FFFF";
      const textWidth = this.camCtx.measureText(prediction.class).width;
      const textHeight = parseInt("16px sans-serif", 10); // base 10
      this.camCtx.fillRect(x, y, textWidth + 4, textHeight + 4);

      // Labels
      this.camCtx.fillStyle = "#000000";
      this.camCtx.fillText(prediction.class, x, y);
    });
  }
}
