import { HttpInterceptorFn } from '@angular/common/http';
import { inject, LOCALE_ID } from '@angular/core';

export const languageInterceptor: HttpInterceptorFn = (req, next) => {
  const locale = inject(LOCALE_ID);
  
  const requestWithLang = req.clone({
    setHeaders: {
      'Accept-Language': locale
    }
  });

  return next(requestWithLang);
};