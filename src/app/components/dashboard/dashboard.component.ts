import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { MatBottomSheet } from '@angular/material';
import { DashboardService } from 'src/app/services/dashboard.service';

import jsQR from 'jsqr';
import { Point } from 'jsqr/dist/locator';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('videoPreview') videoPreview: ElementRef;
  @ViewChild('scanningCanvas') scanningCanvas: ElementRef;
  constructor(private route: ActivatedRoute, private service: DashboardService ) { }
  registrants: object[];
  ngOnInit() {
    this.service.getRegistrants()
                .subscribe((data => this.registrants = data));
  }
  startScanning() {
    const video: HTMLVideoElement = this.videoPreview.nativeElement;
    const canvasEl: HTMLCanvasElement = this.scanningCanvas.nativeElement;
    const canvas: CanvasRenderingContext2D = canvasEl.getContext('2d');
    navigator.mediaDevices.getUserMedia({audio: false, video: {facingMode: 'environment'}})
             .then((videoStream) => {
                video.srcObject = videoStream;
                video.setAttribute('playsinline', 'true');
                video.play();
               requestAnimationFrame(tick);
             })
             .catch((e) => {

             });
    function drawLine(begin: Point, end: Point, color: string) {
      canvas.beginPath();
      canvas.moveTo(begin.x, begin.y);
      canvas.lineTo(end.x, end.y);
      canvas.lineWidth = 4;
      canvas.strokeStyle = color;
      canvas.stroke();
    }
    function tick() {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvasEl.height = video.videoHeight;
        canvasEl.width = video.videoWidth;
        canvasEl.hidden = false;
        canvas.drawImage(video, 0, 0, canvasEl.width, canvasEl.height);
        const imageData = canvas.getImageData(0, 0, canvasEl.width, canvasEl.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });
        if (code) {
          drawLine(code.location.topLeftCorner, code.location.topRightCorner, '#FF3B58');
          drawLine(code.location.topRightCorner, code.location.bottomRightCorner, '#FF3B58');
          drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, '#FF3B58');
          drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, '#FF3B58');

        } else {

        }
      }
      requestAnimationFrame(tick);
    }
  }
}
