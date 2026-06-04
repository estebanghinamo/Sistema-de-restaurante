import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { restauranteResolver } from './restaurante-resolver';

describe('restauranteResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => restauranteResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
