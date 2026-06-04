import { Routes } from '@angular/router';

import { promocionesResolver } from './resolvers/promociones-resolver';
import { iaRecomendacionesResolver } from './resolvers/recomendaciones-ia-resolver';
import { restauranteResolver } from './resolvers/restaurante-resolver';

import { PromocionResource } from './api/resources/promocion.resource';
import { RecomendacionIaResource } from './api/resources/recomendacion-ia.resource';
import { RestauranteResource } from './api/resources/restaurante.resource';
import { reservaResolver } from './resolvers/reserva-resolver';
import { authGuard } from './guards/auth-guard';
import { HistorialComponent } from './pages/historial/historial';

import { categoriasPreferenciasResolver } from './resolvers/categorias-preferencias-resolver';
import { CategoriaPreferenciaResource } from './api/resources/categoria-preferencia.resource';

import { restauranteshomeResolver } from './resolvers/restauranteshome-resolver';
import { RestauranteshomeResource } from './api/resources/restauranteshome.resource';
import { UsuarioResource } from './api/resources/usuario.resource';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login),
    data: { breadcrumb: $localize`:@@breadcrumbLogin:Iniciar sesión` }
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro').then(m => m.Registro),
    resolve: { categoriasPreferencias: categoriasPreferenciasResolver },
    providers: [CategoriaPreferenciaResource],
    data: { breadcrumb: $localize`:@@breadcrumbRegister:Crear cuenta` }
  },
  {
    path: 'main',
    loadComponent: () => import('./pages/main/main').then(m => m.Main),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home').then(m => m.Home),
        resolve: { promociones: promocionesResolver, restauranteshome: restauranteshomeResolver },
        providers: [PromocionResource, RecomendacionIaResource, RestauranteshomeResource],
        data: { breadcrumb: $localize`:@@breadcrumbHome:Inicio` }
      },
      {
        path: 'restaurante/:id',//para el restaurante home
        loadComponent: () => import('./pages/restaurante/restaurante').then(m => m.Restaurante),
        resolve: { restaurante: restauranteResolver },
        providers: [RestauranteResource],
        data: { breadcrumb: $localize`:@@breadcrumbRestaurant:Restaurante` }
      },
      {
        path: 'restaurante/:id/reserva',
        loadComponent: () => import('./pages/reserva/reserva').then(m => m.Reserva),
        resolve: { restaurante: restauranteResolver },
        providers: [RestauranteResource],
        data: { breadcrumb: $localize`:@@breadcrumbNewReservation:Nueva Reserva` }
      },
      {
        path: 'restaurante/:id/:sucursal',//para el carrousel de sucursale
        loadComponent: () => import('./pages/restaurante/restaurante').then(m => m.Restaurante),
        resolve: { restaurante: restauranteResolver },
        providers: [RestauranteResource],
        data: { breadcrumb: $localize`:@@breadcrumbBranch:Sucursal` }
      },
      {
        path: 'misReservas',
        loadComponent: () => import('./pages/historial/historial').then(m => m.HistorialComponent),
        resolve: { reservas: reservaResolver },
        providers: [UsuarioResource],
        data: { breadcrumb: $localize`:@@breadcrumbMyReservations:Mis Reservas` }
      }
    ]
  },
  { path: '**', redirectTo: '/main' }
];