import { NextFunction, Request, Response } from "express";
import { Place, PlaceCategory } from "../interfaces/place.interface";
import { PlaceModel } from "../models/place.model";
import { ServiceModel } from "../models/service.model";

export class PlaceController {
  public getPlaces = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const category = req.query.category as PlaceCategory;

      const places: Place[] = await PlaceModel.find({
        ...(category && { category: category }),
      }).populate({
        path: "services",
        model: ServiceModel,
      });

      await res.status(200).json({ items: places });
    } catch (error) {
      next(error);
    }
  };
}
