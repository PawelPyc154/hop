import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import { PlaceController } from '..//controllers/places.controller';

export class PlaceRoute implements Routes {
  public path = '/places';
  public router = Router();
  public place = new PlaceController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.place.getPlaces);
  }
}
