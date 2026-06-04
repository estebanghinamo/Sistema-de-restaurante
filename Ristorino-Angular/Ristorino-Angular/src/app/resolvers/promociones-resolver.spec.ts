import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { promocionesResolver } from './promociones-resolver';

describe('promocionesResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => promocionesResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
