import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.html',
  styleUrls: ['./confirm-dialog.scss'],
})
export class ConfirmDialog {

  title!: string;
  text!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: { title: string; text: string },
    private ref: MatDialogRef<ConfirmDialog>
  ) {
    this.title = data.title;
    this.text = data.text;
  }

  confirmar(): void {
    this.ref.close(true);
  }

  cancelar(): void {
    this.ref.close(false);
  }
}
