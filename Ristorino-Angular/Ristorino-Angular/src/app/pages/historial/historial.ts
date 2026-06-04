import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppMessageService } from '../../core/services/app-message-service';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UsuarioResource } from '../../api/resources/usuario.resource';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // <--- IMPORTANTE
import { ModificarReservaDialog } from '../../core/layouts/modificar-reserva-dialog/modificar-reserva-dialog';
import { IReservaCliente, EstadoReserva, IHistorial } from '../../api/models/i-historial.model';
import { IEvaluarReservaReq } from '../../api/resources/usuario.resource';
@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
  ],
  templateUrl: './historial.html',
  styleUrls: ['./historial.scss'],
})
export class HistorialComponent implements OnInit {
  private _api = inject(UsuarioResource);
  private _router = inject(Router);
  private _dialog = inject(MatDialog);
  private _msg = inject(AppMessageService);

  constructor(private route: ActivatedRoute) {}

  reservasOriginales: IReservaCliente[] = [];
  itemsMostrados: IReservaCliente[] = [];
  estados: EstadoReserva[] = [];

  loading = false;

  // Filtros
  filtroEstado: number | '' = '';
  filtroFecha: Date | null = null;

  //propiedades para el feedback
  feedbackAbierto: number | null = null; // nroReserva abierta
  comentarios: { [key: number]: string } = {};
  puntuaciones: { [key: number]: number } = {};
 //reconfirmadas: { [key: number]: boolean } = {};
  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      const historial = data['reservas'] as IHistorial;

      this.reservasOriginales = historial?.reservas ?? [];
      this.itemsMostrados = [...this.reservasOriginales];
      this.estados = historial?.estados ?? [];
    });
  }

  buscar(): void {
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.loading = true;

    let filtradas = [...this.reservasOriginales];

    if (this.filtroEstado !== '') {
      filtradas = filtradas.filter((r) => r.codEstado === this.filtroEstado);
    }

    if (this.filtroFecha) {
      const fechaFiltro = this.formatearFecha(this.filtroFecha);
      filtradas = filtradas.filter(
        (r) => this.formatearFechaDesdeDato(r.fechaReserva) === fechaFiltro,
      );
    }

    this.itemsMostrados = filtradas;
    this.loading = false;
  }

  limpiarFiltros(): void {
    this.filtroEstado = '';
    this.filtroFecha = null;
    this.itemsMostrados = [...this.reservasOriginales];
  }

  esPendiente(item: IReservaCliente): boolean {
    return item.codEstado === 1;
  }

  modificarReserva(item: IReservaCliente): void {
    const ref = this._dialog.open(ModificarReservaDialog, {
      width: '520px',
      data: { item },
    });

    ref.afterClosed().subscribe((result) => {
      if (!result) return;

      const req = {
        nroRestaurante: Number(item.nroRestaurante),
        codReservaSucursal: String(item.codReservaSucursal),
        fechaReserva: result.fechaReserva,
        horaReserva: result.horaReserva,
        cantAdultos: Number(result.cantAdultos),
        cantMenores: Number(result.cantMenores),
        codZona: Number(result.codZona),
        costoReserva: Number(result.costoReserva),
      };

      console.log('REQ modificarReserva:', req);

      this._api.modificarReserva(req).subscribe({
        next: (resp) => {
          console.log('OK modificarReserva:', resp);

          this._msg.showMessage({
            title: $localize`Reserva modificada`,
            text: resp?.message ?? $localize`La reserva fue modificada correctamente.`,
            type: 'success',
          });

          this.refrescarHistorial();
        },
        error: (err) => {
          console.error('ERROR modificarReserva:', err);

          this._msg.showMessage({
            title: $localize`Error`,
            text: err?.error?.message ?? $localize`No se pudo modificar la reserva.`,
            type: 'error',
          });
        },
      });
    });
  }

  private refrescarHistorial(): void {
    this.loading = true;

    this._api.getHistorial().subscribe({
      next: (historial: IHistorial) => {
        this.reservasOriginales = historial?.reservas ?? [];
        this.estados = historial?.estados ?? [];

        this.aplicarFiltros();
      },
      error: (err) => {
        console.error('Error refrescando historial', err);
        this._msg.showMessage({
          title: $localize`Error`,
          text: $localize`No se pudo refrescar el historial.`,
          type: 'error',
        });
      },
      complete: () => (this.loading = false),
    });
  }

  cancelar(item: IReservaCliente): void {
    if (!this.esPendiente(item)) return;

    const ref = this._msg.confirm(
      `¿Cancelar la reserva #${item.nroReserva}?`,
      'Confirmar cancelación',
    );

    ref.afterClosed().subscribe((ok) => {
      if (!ok) return;

      const codReservaSucursal = item.codReservaSucursal;
      const nroRestaurante = item.nroRestaurante;

      this.loading = true;

      this._api.cancelarReserva({ codReservaSucursal, nroRestaurante }).subscribe({
        next: (resp) => {
          if (!resp?.success) {
            this._msg.showMessage({
              title: $localize`No se pudo cancelar`,
              text: resp?.message ?? $localize`No se pudo cancelar la reserva.`,
              type: 'warning',
            });
            this.loading = false;
            return;
          }

          const estadoCancelada = this.estados.find((e) => e.codEstado === 2);

          if (estadoCancelada) {
            this.actualizarEstadoLocal(
              item.nroReserva,
              estadoCancelada.codEstado,
              estadoCancelada.nomEstado,
            );
          }

          this.aplicarFiltros();

          this._msg.showMessage({
            title: $localize`Reserva cancelada`,
            text: $localize`La reserva fue cancelada correctamente.`,
            type: 'success',
          });
        },
        error: () => {
          this._msg.showMessage({
            title: $localize`Error`,
            text: $localize`Ocurrió un error al cancelar la reserva.`,
            type: 'error',
          });
        },
        complete: () => (this.loading = false),
      });
    });
  }

  private actualizarEstadoLocal(nroReserva: number, codEstado: number, nomEstado: string): void {
    const patch = (arr: IReservaCliente[]) =>
      arr.map((r) => (r.nroReserva === nroReserva ? { ...r, codEstado, nomEstado } : r));

    this.reservasOriginales = patch(this.reservasOriginales);
    this.itemsMostrados = patch(this.itemsMostrados);
  }

  private formatearFecha(date: Date): string {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  }

  private formatearFechaDesdeDato(valor: any): string {
    if (!valor) return '';
    if (valor instanceof Date) return this.formatearFecha(valor);

    const s = String(valor);
    if (s.includes('T')) return s.split('T')[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

    const d = new Date(s);
    return isNaN(d.getTime()) ? '' : this.formatearFecha(d);
  }



//Método para abrir/cerrar feedback
  toggleFeedback(item: IReservaCliente): void {
  if (this.feedbackAbierto === item.nroReserva) {
    this.feedbackAbierto = null;
  } else {
    this.feedbackAbierto = item.nroReserva;
  }
}
//Método para seleccionar estrella
seleccionarPuntuacion(item: IReservaCliente, n: number): void {
  this.puntuaciones[item.nroReserva] = n;
}

enviarFeedback(item: IReservaCliente): void {

  const comentario = this.comentarios[item.nroReserva] || '';
  const puntuacion = this.puntuaciones[item.nroReserva] || null;

  // Si ambos vacíos → no hacer nada
  if (!comentario && !puntuacion) {
    this._msg.showMessage({
      title: $localize`Atención`,
      text: $localize`Debes ingresar comentario o puntuación.`,
      type: 'warning'
    });
    return;
  }

  const req: IEvaluarReservaReq = {
  codReservaSucursal: item.codReservaSucursal,
  nroRestaurante: item.nroRestaurante
};

if (comentario) {
  req.feedback = comentario;
}

if (puntuacion) {
  req.puntuacion = puntuacion;
}

  this.loading = true;

  this._api.evaluarReserva(req).subscribe({

    next: (resp) => {

      if (!resp?.success) {
        this._msg.showMessage({
          title: $localize`No se pudo enviar`,
          text: resp?.message ?? $localize`Error al registrar el feedback.`,
          type: 'warning'
        });
        this.loading = false;
        return;
      }

      this._msg.showMessage({
        title: $localize`Feedback enviado`,
        text: $localize`Gracias por tu opinión.`,
        type: 'success'
      });

      this.feedbackAbierto = null;
      this.refrescarHistorial();
    },

    error: () => {
      this._msg.showMessage({
        title: $localize`Error`,
        text: $localize`No se pudo enviar el feedback.`,
        type: 'error'
      });
      this.loading = false;
    }

  });
}

/*reconfirmar reserva(eliminar atributo arriba)
reconfirmar(item: IReservaCliente): void {

  if (this.reconfirmadas[item.nroReserva]) return;

  const ref = this._msg.confirm(
    `¿Reconfirmar la reserva #${item.nroReserva}?`,
    'Confirmar asistencia'
  );

  ref.afterClosed().subscribe((ok) => {

    if (!ok) return;

    const req = {
      codReservaSucursal: item.codReservaSucursal,
      nroRestaurante: item.nroRestaurante
    };

    this.loading = true;

    this._api.reconfirmarReserva(req).subscribe({

      next: (resp) => {

        if (!resp?.success) {
          this._msg.showMessage({
            title: $localize`No se pudo reconfirmar`,
            text: resp?.message ?? $localize`Error al reconfirmar.`,
            type: 'warning'
          });
          this.loading = false;
          return;
        }

        // 🔹 Marcamos como reconfirmada localmente
        this.reconfirmadas[item.nroReserva] = true;

        this._msg.showMessage({
          title: $localize`Reserva reconfirmada`,
          text: $localize`Tu asistencia fue confirmada.`,
          type: 'success'
        });

      },

      error: () => {
        this._msg.showMessage({
          title: $localize`Error`,
          text: $localize`No se pudo reconfirmar la reserva.`,
          type: 'error'
        });
      },

      complete: () => this.loading = false
    });

  });
}*/
}
