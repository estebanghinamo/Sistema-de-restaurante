import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';


import { AppMessageService } from '../../core/services/app-message-service';
import { RestauranteResource } from '../../api/resources/restaurante.resource';
import { IReserva } from '../../api/models/i-reserva.model';
import { IZona } from '../../api/models/i-zona.model';
import { IHorarioRespuesta, IHorario } from '../../api/models/i-horario-respuesta.model';
import { ISolicitudHorario } from '../../api/models/i-solicitud-horario.model';


@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule,
    MatDatepickerModule, MatNativeDateModule, MatIconModule, MatSelectModule, MatCheckboxModule
  ],
  templateUrl: './reserva.html',
  styleUrl: './reserva.scss'
})
export class Reserva implements OnInit {

  reservaForm!: FormGroup;


  restaurante: any;
  sucursal: any;

  loading = false;
  minDate = new Date();

 
  zonasDisponibles: IZona[] = [];

  horariosDisponibles: IHorario[] = [];
  costo: number = 0; 


 
  busquedaRealizada = false;
  horaSeleccionada: IHorario | null = null;
//esPremium: boolean = false; en caso de agregar el destacado en el restaurante

  private _fb = inject(FormBuilder);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _api = inject(RestauranteResource);
  private _msg = inject(AppMessageService);

  ngOnInit(): void {
  
    this.reservaForm = this._fb.group({
      fecha: [new Date(), Validators.required],
      cantAdultos: [2, [Validators.required, Validators.min(1)]],
      cantMenores: [0, [Validators.required, Validators.min(0)]], 
      codZona: [null, Validators.required],
      //observaciones: [''] // Campo opcional agregado para observaciones de la reserva
      //tipoReserva: ['NORMAL', Validators.required]   sacarle el validator si es para el destacado   
      //si agrego esto, descomentar lo de mas abajo
      
    });
    /*
    //en caso de que se agregue observacion para menores
       this.reservaForm.get('cantMenores')?.valueChanges.subscribe(value => {
      const obsControl = this.reservaForm.get('observaciones');

      if (value > 0) {
        obsControl?.setValidators([Validators.required, Validators.minLength(5)]);
      } else {
        obsControl?.clearValidators();
        obsControl?.setValue('');
      }

      obsControl?.updateValueAndValidity();
    });*/
 
    this._route.data.subscribe((data: any) => {
      this.restaurante = data['restaurante'];
//this.esPremium = this.restaurante?.destacado === 'PREMIUM'; para el destacado
      if (this.restaurante && this.restaurante.sucursales?.length > 0) {
        console.log(' Datos cargados en Reserva:', this.restaurante);

      
        this.sucursal = history.state.sucursal || this.restaurante.sucursales[0];

      
        if (this.sucursal.zonas) {
          this.zonasDisponibles = this.sucursal.zonas;

          if (this.zonasDisponibles.length > 0) {
            this.reservaForm.patchValue({ codZona: this.zonasDisponibles[0].codZona });
          }
        }
      } else {
        console.error(' No llegaron datos del restaurante al Resolver.');
        this._msg.showMessage({
          title: $localize`Error`,
          text: $localize`No se pudieron cargar los datos del restaurante.`,
          type: 'error'
        });
      }
    });


    this.sucursal
  }

  
  buscarDisponibilidad(): void {
    if (this.reservaForm.invalid) {
      this.reservaForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.busquedaRealizada = false;
    this.horariosDisponibles = [];
    this.horaSeleccionada = null;
    this.costo = 0; 

    const val = this.reservaForm.value;
    const fechaStr = this.formatearFecha(val.fecha);

    const solicitud: ISolicitudHorario = {
      codSucursalRestaurante: this.sucursal.codSucursalRestaurante,
      idSucursal: this.sucursal.id || this.sucursal.nroSucursal,
      fecha: fechaStr,
      cantComensales: Number(val.cantAdultos) + Number(val.cantMenores), 
      codZona: val.codZona,
      menores: val.cantMenores > 0 
    };

    console.log('🔎 Consultando disponibilidad:', solicitud);

    this._api.consultarDisponibilidad(solicitud).subscribe({
      next: (resp: IHorarioRespuesta) => {
        this.horariosDisponibles = resp.horarios || [];
        this.costo = resp.costo || 0;
        this.busquedaRealizada = true;
        this.loading = false;
        console.log(' Disponibilidad recibida:', resp);
        console.log('Horarios disponibles:', this.horariosDisponibles);

        if (this.horariosDisponibles.length === 0) {
          this._msg.showMessage({
            title: $localize`Sin disponibilidad`,
            text: $localize`No hay horarios disponibles para la fecha y zona seleccionadas.`,
            type: 'info'
          });
        }
      },
      error: (err) => {
        console.error('Error consultando disponibilidad:', err);

        this._msg.showMessage({
          title:  $localize`Error`,
          text: err?.error?.message ||  $localize`Error al consultar horarios disponibles.`,
          type: 'error'
        });

        this.loading = false;
      }
    });
  }

  seleccionarHorario(hora: IHorario): void {
    this.horaSeleccionada = hora;
  }

  private formatearFecha(date: Date): string {
    const d = new Date(date);
    const m = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const y = d.getFullYear();
    return [y, m.padStart(2, '0'), day.padStart(2, '0')].join('-');
  }

  
 confirmarReserva(): void {
  if (!this.horaSeleccionada) {
    this._msg.showMessage({
      title: $localize`Horario requerido`,
      text: $localize`Debe seleccionar un horario para confirmar la reserva.`,
      type: 'warning'
    });
    return;
  }

  const emailUsuario = localStorage.getItem('email');

  if (!emailUsuario) {
    this._msg.showLoginRequired();
    return;
  }

  this.loading = true;
  const val = this.reservaForm.value;

  const nuevaReserva: IReserva = {
    codSucursalRestaurante: this.sucursal.codSucursalRestaurante,
    correo: emailUsuario,
    idSucursal: Number(this.sucursal.nroSucursal || this.sucursal.id),
    fechaReserva: this.formatearFecha(val.fecha),
    horaReserva: this.horaSeleccionada.horaReserva,
    cantAdultos: Number(val.cantAdultos),
    cantMenores: Number(val.cantMenores),
    codZona: Number(val.codZona),
    costoReserva: this.costo
  };

  console.log('📦 ENVIANDO RESERVA:', nuevaReserva);

  this._api.RegistrarReserva(nuevaReserva).subscribe({
    next: (resp) => {
      this.loading = false;

      const codigo = resp.codReserva;
      const puntos = resp.puntos;
      const categoria = resp.categoria;
      const fechaExp = resp.fechaExpiracion;

      let mensaje = $localize`Tu reserva fue confirmada correctamente.\nCódigo: ${codigo}`;

      
      if (puntos) {

        const fechaFormateada = fechaExp
          ? new Date(fechaExp).toLocaleDateString()
          : '';

        const categoriaCapitalizada = categoria
          ? categoria.charAt(0).toUpperCase() + categoria.slice(1)
          : '';

        mensaje += `

 Ganaste ${puntos} puntos
 Categoría: ${categoriaCapitalizada}
 Vencen: ${fechaFormateada}`;
      }

      const ref = this._msg.showMessage({
        title: $localize`Reserva confirmada`,
        text: mensaje,
        type: 'success'
      });

      ref.afterClosed().subscribe(() => {
        this._router.navigate(['/main/misReservas']);
      });
    },
    error: (err) => {
      console.error('Error al confirmar reserva:', err);

      this._msg.showMessage({
        title: $localize`Error`,
        text: err?.error?.message || $localize`Hubo un error al registrar la reserva. Verifique los datos.`,
        type: 'error'
      });

      this.loading = false;
    }
  });
}
}
