import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { Header } from '../../components/header/header';

import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    RouterOutlet, 
    Header, 
    RouterModule,
    BreadcrumbComponent 
  ],
  templateUrl: './main.html',
  styleUrls: ['./main.scss']
})
export class Main {}