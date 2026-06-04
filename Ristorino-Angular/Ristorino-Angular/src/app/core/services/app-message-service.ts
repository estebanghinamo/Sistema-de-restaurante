import { inject, Injectable } from '@angular/core';
import { IMessage } from '../../api/models/i-message';
import { MatDialog,MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageDialog } from '../layouts/message-dialog/message-dialog';
import { LoginRequiredDialog } from '../layouts/login-required-dialog/login-required-dialog';
import { ConfirmDialog } from '../layouts/confirm-dialog/confirm-dialog';

@Injectable()
export class AppMessageService {
  
  private dialog = inject(MatDialog);
  private router = inject(Router);

  showMessage(message: IMessage): MatDialogRef<MessageDialog> {
    return this.dialog.open(MessageDialog, {
      data: message,
      width: '380px',
      disableClose: true,
      autoFocus: false
    });
  }


  showLoginRequired(): void {
    this.dialog.open(LoginRequiredDialog, {
      width: '420px',
      disableClose: true,
      autoFocus: false
    });
  }

  confirm(text: string, title?: string) {
    return this.dialog.open(ConfirmDialog, {
      width: '420px',
      disableClose: true,
      autoFocus: false,
      data: { title, text }
    });
  }
}
