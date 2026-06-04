import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppMessageService } from '../../core/services/app-message-service';

import { IPromocion } from '../../api/models/i-promocion.model';
import { IClickPromocion } from '../../api/models/i-click-promocion.model';
import { IRecomendacionIa } from '../../api/models/i-recomendacion-ia';

import { PromocionResource } from '../../api/resources/promocion.resource';
import { RecomendacionIaResource } from '../../api/resources/recomendacion-ia.resource';

import { IRestauranteHomeModel } from '../../api/models/i-restaurante-home.model';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FavoritosResource } from '../../api/resources/favoritos.resource';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home {
  currentIndex = 0;
  intervalId: any;
  @ViewChild('carouselTrack') track!: ElementRef;
  @ViewChild('carouselWrapper') wrapper!: ElementRef;

  translateX = 0;
  cardWidth = 0;
  gap = 32; // mismo que en CSS

  textoBusqueda = '';
  resultados: IRecomendacionIa[] = [];
  buscando = false;
  busquedaEjecutada = false;

  promociones: IPromocion[] = [];
  restaurantes: IRestauranteHomeModel[] = [];
  sucursalesHome: {
    nroRestaurante: string;
    razonSocial: string;
    sucursal: any;
  }[] = [];

estaLogueado = false;

  /* Colores para los badges de proposito (verde, rojo, azul, amarillo)
  private coloresBadges = [
    { bg: '#10b981', text: '#fff' },    // Verde
    { bg: '#ef4444', text: '#fff' },    // Rojo
    { bg: '#3b82f6', text: '#fff' },    // Azul
    { bg: '#f59e0b', text: '#fff' },    // Amarillo/Amber
  ];

  // Map para almacenar colores por promoción
  promoColores: Map<string, { bg: string; text: string }> = new Map();
  badgeColores: Map<number, { bg: string; text: string }> = new Map();
*/
  constructor(
    private route: ActivatedRoute,
    private promoApi: PromocionResource,
    private iaApi: RecomendacionIaResource,
    private messageService: AppMessageService,
    private favoritosApi: FavoritosResource,
  ) {}

 
 
  /*getColorParaBadge(index: number): { bg: string; text: string } {
    if (!this.badgeColores.has(index)) {
      const colorAleatorio = this.coloresBadges[
        Math.floor(Math.random() * this.coloresBadges.length)
      ];
      this.badgeColores.set(index, colorAleatorio);
    }
    return this.badgeColores.get(index)!;
  }*/


ngOnInit(): void {

  const token = localStorage.getItem('token');
   this.estaLogueado = !!token;

  //  Cargar datos del resolver
  this.route.data.subscribe((data) => {

    this.promociones = data['promociones'] ?? [];
    this.restaurantes = data['restauranteshome'] ?? [];

    // Armar sucursales para el carrusel
    this.sucursalesHome = [];

    for (const r of this.restaurantes) {
      for (const s of r.sucursales) {
        this.sucursalesHome.push({
          nroRestaurante: r.nroRestaurante,
          razonSocial: r.razonSocial,
          sucursal: s,
        });
      }
    }

    if (this.sucursalesHome.length > 0) {
      this.startCarousel();
    }


  });

}
  registrarClick(promo: IPromocion): void {
    const click: IClickPromocion = {
      nroRestaurante: promo.nroRestaurante,
      nroContenido: promo.nroContenido,
      emailUsuario: localStorage.getItem('email') || '',
    };

    this.promoApi.registrarClick(click).subscribe(() => {
      console.log(`Click registrado: rest=${click.nroRestaurante}, cont=${click.nroContenido}`);
    });
  }

  buscar(): void {
    console.log('BUSCAR CLICK', this.textoBusqueda);

    if (!this.textoBusqueda.trim()) {
      this.resultados = [];
      this.busquedaEjecutada = false;
      return;
    }

    this.busquedaEjecutada = true;
    this.buscando = true;

    const emailUsuario = localStorage.getItem('email');

    this.iaApi
      .buscar({
        texto: this.textoBusqueda,
        emailUsuario: emailUsuario ? emailUsuario : null,
      })
      .subscribe({
        next: (lista) => {
          const resultadosFiltrados = lista
            .filter((r) => r.coincidencias > 0)
            .sort((a, b) => b.coincidencias - a.coincidencias);

          this.resultados = resultadosFiltrados;
          this.buscando = false;

          if (resultadosFiltrados.length === 0) {
            this.busquedaEjecutada = false;
            this.messageService.showMessage({
              title: $localize`Sin resultados`,
              text: $localize`Lo sentimos, no encontramos resultados para tu búsqueda.`,
            });
          }
        },
        error: () => {
          this.resultados = [];
          this.buscando = false;
          this.busquedaEjecutada = false;

          this.messageService.showMessage({
            title: $localize`Error`,
            text: $localize`Ocurrió un error al realizar la búsqueda. Intentá nuevamente.`,
          });
        },
      });
  }
  startCarousel() {
    setTimeout(() => {
      const firstCard = this.track.nativeElement.children[0];
      this.cardWidth = firstCard.offsetWidth;

      const totalCards = this.sucursalesHome.length;

      this.intervalId = setInterval(() => {
        this.currentIndex++;

        if (this.currentIndex >= totalCards) {
          this.currentIndex = 0;
        }

        this.translateX = this.currentIndex * (this.cardWidth + this.gap);

        const maxScroll =
          this.track.nativeElement.scrollWidth - this.wrapper.nativeElement.offsetWidth;

        if (this.translateX >= maxScroll) {
          this.translateX = 0;
          this.currentIndex = 0;
        }
      }, 5500);
    });
  }

  goTo(index: number) {
    this.currentIndex = index;
    this.translateX = index * (this.cardWidth + this.gap);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  /* PARA LAS CATEGORIAS DE LAS SUCURSALES
getPreferenciasEntries(pref: { [key: string]: string[] } | null | undefined) {
  return pref ? Object.entries(pref) : [];
}
*/





toggleFavorito(nroRestaurante: string, event: Event): void {
  event.stopPropagation();

  if (!this.estaLogueado) return;

  this.favoritosApi.toggleFavorito({ nroRestaurante })
    .subscribe(resp => {

      if (resp?.success) {

        const restaurante = this.restaurantes
          .find(r => r.nroRestaurante === nroRestaurante);

        if (restaurante) {
          restaurante.esFavorito = !restaurante.esFavorito;
        }

      }

    });
}


}
