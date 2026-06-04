import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Loader, LoaderService } from '../../services/loader-service';

@Component({
  selector: 'app-loader-icon',
  standalone: true,              
  imports: [CommonModule],
  templateUrl: './loader-icon.html',
  styleUrls: ['./loader-icon.scss']  
})
export class LoaderIcon implements OnInit, OnDestroy {
  private _subscription!: Subscription;
  loaded = false;

  constructor(private _service: LoaderService) {}

  ngOnInit(): void {
    this._subscription = this._service.loader$.subscribe((ref: Loader) => {
      this.loaded = ref.loaded;
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}

