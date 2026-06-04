import { ApplicationConfig,  ErrorHandler,  importProvidersFrom,  provideBrowserGlobalErrorListeners,  provideZoneChangeDetection,} from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { provideAnimations } from '@angular/platform-browser/animations';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';

import { ResourceHandler } from '@ngx-resource/core';
import { ResourceHandlerHttpClient } from '@ngx-resource/handler-ngx-http';

import { routes } from './app.routes';
import { appHttpInterceptor } from './core/interceptors/app-http-interceptor';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'; // Importante
import { languageInterceptor } from './core/interceptors/language-interceptor';

import { CoreModule } from './core/core-module';
import { AppErrorHandler } from './core/handlers/app-error-handler';
import { FavoritosResource } from './api/resources/favoritos.resource';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),

    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),

    provideHttpClient(
      withInterceptors([
        appHttpInterceptor,
        authInterceptor,
        languageInterceptor
      ])
    ),

    provideAnimations(),
    provideNativeDateAdapter(),

    importProvidersFrom(MatDialogModule),

    importProvidersFrom(CoreModule),

    { provide: ResourceHandler, useClass: ResourceHandlerHttpClient },
    { provide: ErrorHandler, useClass: AppErrorHandler },
     FavoritosResource
  ],
};
