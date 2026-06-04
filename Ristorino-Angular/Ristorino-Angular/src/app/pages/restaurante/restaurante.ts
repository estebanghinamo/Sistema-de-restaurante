import { Component, OnInit, inject  } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { IRestaurante } from '../../api/models/i-restaurante.model';
import { RestauranteResource } from '../../api/resources/restaurante.resource';
import { ISucursal } from '../../api/models/i-sucursal.model';
import {IPreferencia} from '../../api/models/i-preferencia.model';
import { PromocionResource } from '../../api/resources/promocion.resource';
import { IPromocion } from '../../api/models/i-promocion.model';
import { AppMessageService } from '../../core/services/app-message-service';
@Component({
  selector: 'app-restaurante',
  standalone: true, 
  imports: [CommonModule, RouterModule],
  templateUrl: './restaurante.html',
  styleUrls: ['./restaurante.scss'],
  providers: [PromocionResource]
})
export class Restaurante implements OnInit {

  restaurante!: IRestaurante;
  sucursalesFiltradas: ISucursal[] = []; 
  private _msg = inject(AppMessageService);
  



  constructor(
    private _route: ActivatedRoute, 
    private _router: Router, 
    private _api: RestauranteResource,
    private promoApi: PromocionResource,
  ) { }

  ngOnInit(): void {
    this._route.data.subscribe((data) => {
      this.restaurante = data['restaurante'];

     
      const sucursalParam = this._route.snapshot.paramMap.get('sucursal');

      if (sucursalParam) {
        const nroSucursal = Number(sucursalParam);

        this.sucursalesFiltradas = this.restaurante.sucursales.filter(
          (s: ISucursal) => s.nroSucursal === nroSucursal
        );
      } else {
        this.sucursalesFiltradas = this.restaurante.sucursales;
      }
      this.sucursalesFiltradas.forEach(s => {
        this.cargarPromocionesSucursal(s);
      })
    });
  }


  
irAReserva(sucursal: ISucursal): void {

    const emailUsuario = localStorage.getItem('email');

    if (!emailUsuario) {
      this._msg.showLoginRequired();
      return;
    }

      console.log(sucursal.nomSucursal)

      if (!sucursal)
        return;

      this._router.navigate(['/main', 'restaurante', this.restaurante.nroRestaurante, 'reserva'], {
        state: {
          sucursal: {
            id: sucursal.nroSucursal,
            nombre: sucursal.nomSucursal,
            calle: sucursal.calle,
            nroCalle: sucursal.nroCalle,
            zonas: sucursal.zonas,
            codSucursalRestaurante: sucursal.codSucursalRestaurante
          },
        }
      });
  }


  getPreferenciasPorCategoria(s: ISucursal): Map<string, IPreferencia[]> {
    const map = new Map<string, IPreferencia[]>();

    if (!s.preferencias) return map;

    for (const p of s.preferencias) {
      if (!map.has(p.nomCategoria)) {
        map.set(p.nomCategoria, []);
      }
      map.get(p.nomCategoria)!.push(p);
    }

    return map;
  }

  cargarPromocionesSucursal(s: ISucursal): void {
  if (s.promociones) return; 

  s.cargandoPromos = true;

  this.promoApi.getPromocionesPorSucursal({
  nroRestaurante: this.restaurante.nroRestaurante,
  nroSucursal: s.nroSucursal
}).subscribe({
  next: (promos: IPromocion[]) => {
    s.promociones = promos;
    s.cargandoPromos = false;
  },
  error: () => {
    s.promociones = [];
    s.cargandoPromos = false;
  }
});

}


}