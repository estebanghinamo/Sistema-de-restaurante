import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';

export interface IBreadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './breadcrumb.html',
  styleUrls: ['./breadcrumb.scss']
})
export class BreadcrumbComponent implements OnInit {

  breadcrumbs: IBreadcrumb[] = [];
  
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.generar();
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.generar());
  }

  private generar(): void {
    const migas: IBreadcrumb[] = [];
    this.procesarRuta(this.activatedRoute.root, '', migas); // ← Cambio 1: URL vacía y sin home inicial
    
    // Si no hay migas o la primera no es "Inicio", agregar Inicio al principio
    if (migas.length === 0 || migas[0].url !== '/main') {
      migas.unshift({ 
        label: $localize`:@@breadcrumbHome:Inicio`, 
        url: '/main' 
      });
    }
    
    this.breadcrumbs = migas;
  }

  private procesarRuta(route: ActivatedRoute, url: string, migas: IBreadcrumb[]): void {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) return;

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      let label = child.snapshot.data['breadcrumb'];
      const datos = child.snapshot.data['restaurante'];

      const breadcrumbOriginal = this.getBreadcrumbKey(child.snapshot.data['breadcrumb']);
      
      // Caso especial: Para "Nueva Reserva", agregar el nombre del restaurante como breadcrumb intermedio
      if (breadcrumbOriginal === 'Nueva Reserva' && datos) {
        const nombre = datos.razonSocial || datos.nombre || $localize`:@@breadcrumbRestaurant:Restaurante`;
        const idRestaurante = datos.nroRestaurante || child.snapshot.params['id'];
        
        if (!migas.some(b => b.url === `/main/restaurante/${idRestaurante}`)) {
          migas.push({
            label: nombre,
            url: `/main/restaurante/${idRestaurante}`
          });
        }
      }
      
      // Caso especial: Para "Restaurante", usar el nombre real del restaurante
      if (breadcrumbOriginal === 'Restaurante' && datos) {
        label = datos.razonSocial || datos.nombre;
      }

      // Caso especial: Para "Sucursal", usar el nombre del restaurante + sucursal
      if (breadcrumbOriginal === 'Sucursal' && datos) {
        const nombreRestaurante = datos.razonSocial || datos.nombre;
        const nroSucursal = child.snapshot.params['sucursal'];
        label = `${nombreRestaurante} - ${$localize`:@@breadcrumbBranch:Sucursal`} #${nroSucursal}`;
      }

      // ← Cambio 2: Solo agregar si tiene label y NO es la ruta /main vacía
      if (label && url !== '/main') { // ← ESTE ES EL CAMBIO CLAVE
        if (!migas.some(b => b.url === url)) {
          migas.push({ label, url });
        }
      }

      return this.procesarRuta(child, url, migas);
    }
  }

  private getBreadcrumbKey(breadcrumb: string): string {
    if (!breadcrumb) return '';
    
    const match = breadcrumb.match(/:(.*?):/);
    if (match) {
      return match[1];
    }
    
    return breadcrumb;
  }
}