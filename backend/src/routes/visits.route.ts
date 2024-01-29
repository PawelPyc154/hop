import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import { VisitController } from "../controllers/visits.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class VisitRoute implements Routes {
  public path = "/visits";
  public router = Router();
  public visit = new VisitController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware, this.visit.getVisits);
    this.router.post(`${this.path}`, AuthMiddleware, this.visit.createVisit);
  }
}
