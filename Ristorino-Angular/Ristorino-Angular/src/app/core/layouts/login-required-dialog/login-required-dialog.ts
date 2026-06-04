import { Component, inject } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login-required-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './login-required-dialog.html',
  styleUrl: './login-required-dialog.scss'
})
export class LoginRequiredDialog {

  private dialogRef = inject(MatDialogRef<LoginRequiredDialog>);
  private router = inject(Router);

  cerrar(): void {
    this.dialogRef.close();
  }

  irLogin(): void {
  const returnUrl = this.router.url;  

  this.dialogRef.close();

  this.router.navigate(
    ['/login'],
    { queryParams: { returnUrl } }
  );
}

}
