import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import type { IMessage } from '../../../api/models/i-message';

@Component({
  selector: 'app-message-dialog',
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatButtonModule
  ],
  templateUrl: './message-dialog.html',
   styleUrls: ['./message-dialog.scss'],
})
export class MessageDialog {

  constructor(@Inject(MAT_DIALOG_DATA) public message: IMessage, public ref: MatDialogRef<MessageDialog>) {}

}
