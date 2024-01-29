import { NextFunction, Response } from "express";

import { VisitModel } from "../models/visit.model";
import { z } from "zod";
import { visitStatuses } from "../interfaces/visit.interface";
import mongoose from "mongoose";
import { ServiceModel } from "../models/service.model";
import { PlaceModel } from "../models/place.model";
import { RequestWithUser } from "../interfaces/auth.interface";

export class VisitController {
  public getVisits = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.userId;

      const myVisits = await VisitModel.find({ user: userId })
        .populate({
          path: "service",
          model: ServiceModel,
          select: "title",
        })
        .populate({
          path: "place",
          model: PlaceModel,
          select: "title",
        });

      const usersInfoSchema = z.array(
        z
          .object({
            _id: z.string(),
            visitDate: z.date(),
            service: z
              .object({ title: z.string() })
              .transform((item) => item.title),

            place: z
              .object({ title: z.string() })
              .transform((item) => item.title),
            status: z.enum(visitStatuses),
          })
          .transform(({ _id, ...item }) => ({
            id: _id,
            ...item,
          }))
      );
      const visits = await usersInfoSchema.parseAsync(myVisits);

      await res.status(200).json({
        items: visits,
      });
    } catch (error) {
      next(error);
    }
  };
  public createVisit = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.userId;

      const { serviceId, placeId, visitDate } = req.body;

      await VisitModel.create({
        _id: new mongoose.Types.ObjectId(),
        visitDate: visitDate,
        service: serviceId,
        place: placeId,
        user: userId,
      });

      await res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  };
}
