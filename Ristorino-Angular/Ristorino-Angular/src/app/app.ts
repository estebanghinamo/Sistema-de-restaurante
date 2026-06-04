import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet, ActivatedRoute, Router } from '@angular/router';
import { LoaderIcon } from './core/layouts/loader-icon/loader-icon';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,LoaderIcon],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit{
  protected readonly title = signal('Ristorino');
   constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit() {
   
    this.route.queryParams.subscribe(params => {
      const tokenTransferido = params['transfer_token'];

      if (tokenTransferido) {
        console.log('🔄 Sincronizando sesión entre puertos...');
        
       
        localStorage.setItem('token', tokenTransferido);
        
        
        this.router.navigate([], {
          queryParams: { 'transfer_token': null },
          queryParamsHandling: 'merge',
          replaceUrl: true
        });
      } 
    });
  }
}
//la transferencia de token se hace para mantener la sesion al cambiar de puerto en el desarrollo local, solo es necesario por ahora


