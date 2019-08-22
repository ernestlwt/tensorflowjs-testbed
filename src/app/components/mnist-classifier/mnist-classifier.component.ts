import { Component, ViewChild, OnInit, AfterViewInit, ElementRef, Input } from '@angular/core';

import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators'

import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'app-mnist-classifier',
  templateUrl: './mnist-classifier.component.html',
  styleUrls: ['./mnist-classifier.component.css']
})
export class MnistClassifierComponent implements OnInit, AfterViewInit{

  // a reference to canvas element from templateUrl
  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  private cx: CanvasRenderingContext2D;
  private myCanvas: HTMLCanvasElement;
  @Input() width = 280;
  @Input() height = 280;

  drawnImage: any;
  prediction: any;
  predictedNumber: string;
  model: any;

  async ngOnInit() {
    this.model = await tf.loadLayersModel('../../assets/model/mnist/model.json');
  }

  ngAfterViewInit() {
    this.myCanvas = this.canvas.nativeElement;
    this.cx = this.myCanvas.getContext('2d');

    this.myCanvas.width = this.width;
    this.myCanvas.height = this.height;

    this.cx.lineWidth = 30;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';
    this.captureEvents(this.myCanvas);
  }

  // capture events from mouse
  captureEvents(canvasE1: HTMLCanvasElement) {
    fromEvent(canvasE1, 'mousedown').pipe(
      switchMap((e) => {
        return fromEvent(canvasE1, 'mousemove').pipe(
          takeUntil(fromEvent(canvasE1, 'mouseup')),
          takeUntil(fromEvent(canvasE1, 'mouseleave')),
          pairwise()
        )
      })
    ).subscribe((res: [MouseEvent, MouseEvent]) => {
      const rect = canvasE1.getBoundingClientRect();
      const prevPos = {
        x: res[0].clientX - rect.left,
        y: res[0].clientY - rect.top
      };
      const currentPos = {
        x: res[1].clientX - rect.left,
        y: res[1].clientY - rect.top
      };
      this.drawOnCanvas(prevPos, currentPos);
    });
  }

  private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
    if (!this.cx){
      return
    }
    this.cx.beginPath();
    if(prevPos){
      this.cx.moveTo(prevPos.x, prevPos.y); // from here
      this.cx.lineTo(currentPos.x, currentPos.y); // to here
      this.cx.stroke();
    }
  }

  clear() {
    this.cx.clearRect(0, 0, this.cx.canvas.width, this.cx.canvas.height);
    this.predictedNumber = "";
  }

  predict() {
    // draw to a top left corner of 28 by 28 pixel and get pixels from there --> MNIST data size
    this.cx.drawImage(this.myCanvas, 0, 0, 28, 28);
    this.drawnImage = this.cx.getImageData(0, 0, 28, 28);

    var temp = [];
    var i;
    for(i = 3; i < this.drawnImage.data.length; i += 4){
      temp.push(this.drawnImage.data[i]);
    }

    var img = tf.reshape(temp, [1, 28, 28, 1]);
    img = tf.cast(img, 'float32');

    // Make and format the predications
    const output = this.model.predict(img) as any;

    // Save predictions on the component
    this.prediction = Array.from(output.dataSync());
    console.log(this.prediction);

    for (let i = 0; i < this.prediction.length; i++) {
      if (this.prediction[i] == "1") {
        this.predictedNumber = i.toString();
      }
    }
    if (this.predictedNumber == "") {
      this.predictedNumber = ":(";
    }
  }

}
