import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { restauranteshomeResolver } from './restauranteshome-resolver';

describe('restauranteshomeResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => restauranteshomeResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
