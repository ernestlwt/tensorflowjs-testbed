import { Component, OnInit, AfterViewInit, ElementRef, Input, ViewChild } from '@angular/core';

import * as cocossd from '@tensorflow-models/coco-ssd';
import { Prediction } from '../../prediction';

@Component({
  selector: 'app-image-classifier',
  templateUrl: './image-classifier.component.html',
  styleUrls: ['./image-classifier.component.css']
})
export class ImageClassifierComponent implements OnInit, AfterViewInit {

  @ViewChild('inCanvas', { static: false }) inCanvas: ElementRef;
  private inCtx: CanvasRenderingContext2D;
  @ViewChild('outCanvas', { static: false }) outCanvas: ElementRef;
  private outCtx: CanvasRenderingContext2D;

  @Input() width = 500;
  @Input() height =350;

  model: any;
  predictions: Prediction[];

  constructor() { }

  async ngOnInit() {
    this.model = await cocossd.load();
  }

  ngAfterViewInit() {
    this.inCtx = this.inCanvas.nativeElement.getContext('2d');
    this.outCtx = this.outCanvas.nativeElement.getContext('2d');

    this.inCanvas.nativeElement.width = this.width;
    this.inCanvas.nativeElement.height = this.height;
    this.outCanvas.nativeElement.width = this.width;
    this.outCanvas.nativeElement.height = this.height;

  }

  fileChanged(event) {
    if(event.target.files && event.target.files.length) {
      // draw image on out canvas
      var url = URL.createObjectURL(event.target.files[0]);
      var newimg = new Image();
      newimg.src = url;
      newimg.onload = async () => {
        // draw image will wait for completion by default
        this.inCtx.drawImage(newimg, 0, 0, this.width, this.height);
        this.outCtx.drawImage(newimg, 0, 0, this.width, this.height);

        // wait for prediction to be completed
        // else bug at draw output using previous prediction values
        await this.doPrediction();

        this.drawOutputOnCanvas();
      }
    }
  }

  async doPrediction() {
    const targetImage = this.inCanvas.nativeElement;
    this.predictions = await this.model.detect(targetImage);
  }

  drawOutputOnCanvas() {
    // font settings
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
