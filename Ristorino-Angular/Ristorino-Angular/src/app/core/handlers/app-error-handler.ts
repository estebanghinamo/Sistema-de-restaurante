import { ErrorHandler, Injectable, inject, isDevMode, NgZone } from '@angular/core';
import { IMessage } from '../../api/models/i-message';
import { AppMessageService } from '../services/app-message-service';

@Injectable()
export class AppErrorHandler implements ErrorHandler {

  private readonly _service = inject(AppMessageService);
  private readonly _zone = inject(NgZone);

  handleError(error: any): void {
  let message: IMessage;

  if (error.rejection) {
    error = error.rejection;
  }


  if (error.error) {


    if (typeof error.error === 'string') {
      message = { text: error.error, num: error.status };
    }

  
    else if (error.error.error) {
      message = { text: error.error.error, num: error.status };
    }


    else if (error.error.message) {
      message = { text: error.error.message, num: error.status };
    }

    else {
      message = { text: 'Error inesperado', num: error.status };
    }

  }
  else if (error.message) {
    message = { text: error.message, num: error.status };
  }
  else {
    message = { text: String(error), num: error.status };
  }

  if (isDevMode()) {
    console.error('[AppErrorHandler]', error);
  }

  this._zone.run(() => this._service.showMessage(message));
}


}
