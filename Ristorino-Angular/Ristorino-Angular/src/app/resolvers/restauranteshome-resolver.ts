import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { RestauranteshomeResource } from '../api/resources/restauranteshome.resource';
import { IRestauranteHomeModel } from '../api/models/i-restaurante-home.model';

export const restauranteshomeResolver: ResolveFn<IRestauranteHomeModel[]> = () => {
  return inject(RestauranteshomeResource).listarRestaurantesHome();
};
