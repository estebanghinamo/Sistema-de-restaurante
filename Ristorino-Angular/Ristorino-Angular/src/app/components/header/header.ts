import { Component, inject, Inject } from '@angular/core'; 
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth'; 
import { DOCUMENT } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  standalone: true
})
export class Header {
  

  private authService = inject(AuthService);
  private router = inject(Router);
  constructor(@Inject(DOCUMENT) private document: Document) {}
  isLoggedIn$ = this.authService.isLoggedIn$(); 

  logout() {
    this.authService.logout();
    this.router.navigate(['/main']);
  }
  getpuerto(){
    return this.document.location.port;
  }
  cambiarIdiomaDev(idioma: 'es' | 'en') {
   
    const puertoDestino = idioma === 'es' ? '4200' : '4201';
    const token = localStorage.getItem('token');

    const protocol = this.document.location.protocol; 
    const hostname = this.document.location.hostname; 
    const path = this.document.location.pathname;     
    const query = this.document.location.search;      
    const puertoActual = this.document.location.port;

    
    if (puertoActual === puertoDestino) {
      console.log('Ya estás en el idioma seleccionado.');
      return;
    }


    let nuevaUrl = `${protocol}//${hostname}:${puertoDestino}${path}${query}`;


      if (token) {
        nuevaUrl += `?transfer_token=${token}`;
      }

 
    this.document.location.href = nuevaUrl;
  }



}



