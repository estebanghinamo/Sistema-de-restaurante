import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { ICategoriaPreferencia } from '../../api/models/i-categoria-preferencia.model';
import { IDominioPreferenciaModel } from '../../api/models/i-dominio-preferencia.model';
import { ICliente } from '../../api/models/i-cliente';

@Component({
  standalone: true,
  selector: 'app-registro',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro.html',
  styleUrl: './registro.scss'
})
export class Registro {

  apellido = '';
  nombre = '';
  correo = '';
  clave = '';
  telefonos = '';
  nomLocalidad = '';
  nomProvincia = '';
  observaciones = '';

  categorias: ICategoriaPreferencia[] = [];
  dominios: IDominioPreferenciaModel[] = [];

  // 🔹 NUEVO: selección múltiple
  categoriasSeleccionadas: number[] = [];

  dominiosPorCategoria: {
    codCategoria: number;
    dominios: number[];
  }[] = [];

  mensaje = '';
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.categorias = this.route.snapshot.data['categoriasPreferencias'];
  }

  // 🔹 NUEVO: toggle categoría
  toggleCategoria(codCategoria: number) {
    const idx = this.categoriasSeleccionadas.indexOf(codCategoria);

    if (idx >= 0) {
      this.categoriasSeleccionadas.splice(idx, 1);
      this.dominiosPorCategoria =
        this.dominiosPorCategoria.filter(c => c.codCategoria !== codCategoria);
    } else {
      this.categoriasSeleccionadas.push(codCategoria);
      this.dominiosPorCategoria.push({
        codCategoria,
        dominios: []
      });
    }
  }

  // 🔹 NUEVO: toggle dominio
  toggleDominio(codCategoria: number, nroDominio: number) {
  const categoria = this.dominiosPorCategoria.find(c => c.codCategoria === codCategoria);
  if (!categoria) return;

  const idx = categoria.dominios.indexOf(nroDominio);
  if (idx >= 0) {
    categoria.dominios.splice(idx, 1);
  } else {
    categoria.dominios.push(nroDominio);
  }
}


  registrar() {

    const cliente: ICliente = {
      apellido: this.apellido,
      nombre: this.nombre,
      correo: this.correo,
      clave: this.clave,
      telefonos: this.telefonos,
      nomLocalidad: this.nomLocalidad,
      nomProvincia: this.nomProvincia,
      observaciones: this.observaciones,

      // 🔹 NUEVO: preferencias múltiples
      preferencias: this.dominiosPorCategoria
    };

    this.authService.registrarCliente(cliente).subscribe({
      next: () => {
        this.authService.login(this.correo, this.clave).subscribe({
          next: res => {
            this.authService.setToken(res.token);
            localStorage.setItem('email', this.correo);
            this.router.navigate(['/main']);
          },
          error: () => {
            this.error = $localize`Registrado, pero error al iniciar sesión`;
          }
        });
      },
      error: err => {
        this.error = err?.error || $localize`Error al registrar el cliente`;
      }
    });
  }


  isDominioSeleccionado(codCategoria: number, nroDominio: number): boolean {
    const cat = this.dominiosPorCategoria.find(c => c.codCategoria === codCategoria);
    return !!cat && cat.dominios.includes(nroDominio);
  }


}
