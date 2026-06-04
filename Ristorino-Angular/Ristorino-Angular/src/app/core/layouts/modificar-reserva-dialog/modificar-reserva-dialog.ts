import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { RestauranteResource } from '../../../api/resources/restaurante.resource';
import { IZona } from '../../../api/models/i-zona.model';
import { IHorarioRespuesta, IHorario } from '../../../api/models/i-horario-respuesta.model';
import { ISolicitudHorario } from '../../../api/models/i-solicitud-horario.model';

@Component({
  selector: 'app-modificar-reserva-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
  ],
  templateUrl: './modificar-reserva-dialog.html',
})
export class ModificarReservaDialog implements OnInit {

  private _apiRestaurante = inject(RestauranteResource);

 
  minDate = new Date();
  fechaNueva: Date | null = null;
  adultosNuevo = 1;
  menoresNuevo = 0;

  loadingZonas = false;
  loadingHorarios = false;

  
  codZonaNuevo: number | null = null;
  zonasDisponibles: IZona[] = [];


  busquedaRealizada = false;
  horariosDisponibles: IHorario[] = [];
  horaSeleccionada: IHorario | null = null;
  costo: number = 0;

  constructor(
    public dialogRef: MatDialogRef<ModificarReservaDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const item = data?.item ?? {};

   
    this.fechaNueva = this.parseYmdToDate(item?.fechaReserva);

    this.adultosNuevo = Number(item?.cantAdultos ?? 1);
    this.menoresNuevo = Number(item?.cantMenores ?? 0);


    this.zonasDisponibles = data?.sucursal?.zonas ?? data?.zonas ?? [];

   
    const zonaItem = item?.codZona;
    this.codZonaNuevo = zonaItem != null ? Number(zonaItem) : null;


    if (this.codZonaNuevo == null && this.zonasDisponibles.length) {
      const primera = this.zonasDisponibles.find((z: any) => z?.habilitada !== false);
      this.codZonaNuevo = primera?.codZona ?? null;
    }
  }

  ngOnInit(): void {

    if (this.zonasDisponibles?.length) return;

    const item = this.data?.item ?? {};
    const nroRestaurante = Number(item?.nroRestaurante);
    const nroSucursal = Number(item?.nroSucursal);

    if (!nroRestaurante || !nroSucursal) return;

    this.loadingZonas = true;

    this._apiRestaurante.getZonasSucursal({ nroRestaurante, nroSucursal }).subscribe({
      next: (zonas: IZona[]) => {
        this.zonasDisponibles = zonas ?? [];

        if (this.codZonaNuevo == null && this.zonasDisponibles.length) {
          const primera = this.zonasDisponibles.find((z: any) => z?.habilitada !== false);
          this.codZonaNuevo = primera?.codZona ?? null;
        }

        this.loadingZonas = false;
      },
      error: (err) => {
        console.error('Error cargando zonas', err);
        this.zonasDisponibles = [];
        this.loadingZonas = false;
      }
    });
  }


  get puedeBuscarHorarios(): boolean {
    return !!this.fechaNueva
      && this.codZonaNuevo != null
      && Number(this.adultosNuevo) >= 1
      && Number(this.menoresNuevo) >= 0;
  }


  get puedeConfirmar(): boolean {
    return this.puedeBuscarHorarios
      && this.busquedaRealizada
      && !!this.horaSeleccionada
      && this.codZonaNuevo != null;
  }


  onCriteriosChange(): void {
    this.busquedaRealizada = false;
    this.horariosDisponibles = [];
    this.horaSeleccionada = null;
  }

  buscarDisponibilidad(): void {
    console.log('CLICK buscarDisponibilidad', {
      fechaNueva: this.fechaNueva,
      codZonaNuevo: this.codZonaNuevo,
      adultosNuevo: this.adultosNuevo,
      menoresNuevo: this.menoresNuevo,
      puedeBuscarHorarios: this.puedeBuscarHorarios,
      item: this.data?.item
    });

    if (!this.puedeBuscarHorarios) return;

    const item = this.data?.item ?? {};

    const nroRestaurante = Number(item?.nroRestaurante);
    const nroSucursal = Number(item?.nroSucursal);

    if (!nroRestaurante || !nroSucursal) {
      alert('Faltan nroRestaurante o nroSucursal para consultar disponibilidad.');
      return;
    }

  
    const codSucursalRestaurante = `${nroRestaurante}-${nroSucursal}`;


    const idSucursal = nroSucursal;

    this.loadingHorarios = true;
    this.busquedaRealizada = false;
    this.horariosDisponibles = [];
    this.horaSeleccionada = null;
    this.costo = 0;

    const solicitud: ISolicitudHorario = {
      codSucursalRestaurante: codSucursalRestaurante,
      idSucursal: idSucursal,
      fecha: this.formatearFecha(this.fechaNueva), // YYYY-MM-DD
      cantComensales: Number(this.adultosNuevo) + Number(this.menoresNuevo),
      codZona: Number(this.codZonaNuevo),
      menores: Number(this.menoresNuevo) > 0
    };

    console.log('Solicitando disponibilidad:', solicitud);

    this._apiRestaurante.consultarDisponibilidad(solicitud).subscribe({
      next: (resp) => {
        console.log('RESP horarios', resp);
        this.horariosDisponibles = resp.horarios || [];
        this.costo = resp.costo || 0;
        this.busquedaRealizada = true;
        this.loadingHorarios = false;
      },
      error: (err) => {
        console.error('ERROR horarios', err);
        this.busquedaRealizada = true;
        this.horariosDisponibles = [];
        this.costo = 0;
        this.loadingHorarios = false;
        alert($localize`Error al consultar horarios.`);
      }
    });
  }

  seleccionarHorario(h: IHorario): void {
    this.horaSeleccionada = h;
  }

  cerrar(): void {
    this.dialogRef.close(false);
  }


  private toHms(h: string): string {
    const s = (h || '').trim();
    if (/^\d{2}:\d{2}$/.test(s)) return s + ':00';
    return s;
  }

  ok(): void {
    if (!this.puedeConfirmar) return;

    const fechaStr = this.formatearFecha(this.fechaNueva); // "yyyy-MM-dd"
    const horaStr = this.toHms(String(this.horaSeleccionada?.horaReserva ?? ''));

    if (!fechaStr) {
      alert($localize`Elegí una fecha`);
      return;
    }
    if (!horaStr) {
      alert($localize`Elegí un horario`);
      return;
    }

    this.dialogRef.close({
      fechaReserva: fechaStr,
      horaReserva: horaStr,
      cantAdultos: Number(this.adultosNuevo),
      cantMenores: Number(this.menoresNuevo),
      codZona: Number(this.codZonaNuevo),
      costoReserva: this.costo
    });
  }

  private parseYmdToDate(value: any): Date | null {
    const s = String(value ?? '').trim();
    if (!s) return null;

   
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
      const y = Number(s.substring(0, 4));
      const m = Number(s.substring(5, 7));
      const d = Number(s.substring(8, 10));
      return new Date(y, m - 1, d); 
    }


    const m1 = s.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
    if (m1) return new Date(Number(m1[3]), Number(m1[2]) - 1, Number(m1[1]));

 
    const m2 = s.match(/^(\d{2})-(\d{2})-(\d{4})/);
    if (m2) return new Date(Number(m2[3]), Number(m2[2]) - 1, Number(m2[1]));

    return null;
  }

  private formatearFecha(date: Date | null): string {
    if (!date) return '';
    const d = new Date(date);
    const m = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const y = d.getFullYear();
    return [y, m.padStart(2, '0'), day.padStart(2, '0')].join('-');
  }
}
