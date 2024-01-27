import { NextFunction, Request, Response } from 'express';
// import { Container } from 'typedi';
// import { UserService } from '@services/users.service';
import { Place, PlaceCategory } from '@/interfaces/place.interface';
import { PlaceModel } from '@/models/place.model';

export class PlaceController {
  // public user = Container.get(UserService);

  public getPlaces = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = req.query.category as PlaceCategory;

      const places: Place[] = await PlaceModel.find({
        ...(category && { category: category }),
      });
      // .populate('services');

      await res.status(200).json({ items: places, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };
}
