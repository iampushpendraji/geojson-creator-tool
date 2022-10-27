import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-box',
  templateUrl: './confirm-box.component.html',
  styleUrls: ['./confirm-box.component.css']
})
export class ConfirmBoxComponent implements OnInit {
  messageData: string;
  constructor(private dialogRef: MatDialogRef<ConfirmBoxComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      this.messageData = data.messageData;
    }
  }

  ngOnInit(): void {
  }

  closeDialog(data: boolean) {
    this.dialogRef.close(data);
  }

}
