import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';

import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(private route: ActivatedRoute, private service: DashboardService, private dialog: MatDialog,
              private snackBar: MatSnackBar ) { }
  registrants: any;
  numCheckedIn: number;
  ngOnInit() {
    this.service.getStats('numCheckedIn').subscribe(data => this.numCheckedIn = data['numCheckedIn']);
  }
  onSearchChange(q: string) {
    if (q.length >= 3) {
      this.service.getRegistrants(q).subscribe(result => this.registrants = result);
      this.service.getStats('numCheckedIn').subscribe(data => this.numCheckedIn = data['numCheckedIn']);
    }
  }
  checkIn(user: any) {
    this.service.checkInUser(user.id).subscribe(data => user.checkedIn = true);
  }
  isUserMinor(dateOfBirth: string) {
    return this.service.isUserMinor(dateOfBirth);
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
