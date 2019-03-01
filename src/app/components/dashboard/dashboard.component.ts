import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';

import jsQR from 'jsqr';
import { Point } from 'jsqr/dist/locator';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('videoPreview') videoPreview: ElementRef;
  @ViewChild('scanningCanvas') scanningCanvas: ElementRef;
  constructor(private route: ActivatedRoute, private service: DashboardService, private dialog: MatDialog,
              private snackBar: MatSnackBar ) { }
  registrants: any;
  cameraOpen = false;
  animationFrameInstance: number;
  userMediaInstance: MediaStreamTrack;
  ngOnInit() {
  }
  onSearchChange(q: string) {
    if (q.length >= 3) {
      this.service.getRegistrants(q).subscribe(result => this.registrants = result);
    }
  }
  checkIn(user: any) {
    this.service.checkInUser(user.id).subscribe(data => user.checkedIn = true);
  }
  isUserMinor(dateOfBirth: string) {
    return this.service.isUserMinor(dateOfBirth);
  }
  stopScanning() {
    const video: HTMLVideoElement = this.videoPreview.nativeElement;
    const canvasEl: HTMLCanvasElement = this.scanningCanvas.nativeElement;
    this.cameraOpen = false;
    canvasEl.style.visibility = 'hidden';
    this.userMediaInstance.stop();
    video.pause();
    cancelAnimationFrame(this.animationFrameInstance);
  }
  startScanning() {
    const video: HTMLVideoElement = this.videoPreview.nativeElement;
    const canvasEl: HTMLCanvasElement = this.scanningCanvas.nativeElement;
    const canvas: CanvasRenderingContext2D = canvasEl.getContext('2d');
    const service = this.service;
    const dialog = this.dialog;
    const sb = this.snackBar;
    const ins = this;
    this.cameraOpen = true;
    navigator.mediaDevices.getUserMedia({audio: false, video: {facingMode: 'environment'}})
             .then((videoStream) => {
                this.userMediaInstance = videoStream.getTracks()[0];
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
      if (ins.cameraOpen === true) {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvasEl.height = video.videoHeight;
          canvasEl.width = video.videoWidth;
          canvasEl.style.visibility = 'visible';
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
            let dialogRef;
            service.getRegistrants(undefined, code.data).subscribe((resp) => {
            if (resp.checkedIn === true) {
              sb.open(`${resp.firstName} ${resp.lastName} has already been checked-in`, undefined, {
                duration: 1500
              });
              setTimeout(function () {
                requestAnimationFrame(tick);
              }, 1500);
            }
            else {
              dialogRef = dialog.open(CheckInDialogComponent, {
                data: {
                  user: resp
                }
              });
            }
            dialogRef.afterClosed().subscribe(result => {
              if (result.id) {
                service.checkInUser(result.id).subscribe(data => console.log(data) );
              }
              requestAnimationFrame(tick);
            });
          }, error => {
            console.log(error);
            if (error.statusCode) {
              dialogRef = dialog.open(CheckInDialogComponent, {
                data: {
                  message: error.message
                }
              });
            }
          } );
          }
          else {
            requestAnimationFrame(tick);
          }
        }
        else {
           requestAnimationFrame(tick);
        }
      }
  }
  }
}
@Component({
  selector: 'check-in-dialog',
  templateUrl: 'check-in-dialog.html',
})
export class CheckInDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data, private service: DashboardService) {}
  isUserMinor(dateOfBirth: string) {
    return this.service.isUserMinor(dateOfBirth);
  }
}
