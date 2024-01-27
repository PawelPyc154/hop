import { Place, Visit } from "database";
import { visitStatutes } from "types";
import express from "express";
import { auth } from "../auth/auth";
import mongoose from "mongoose";
import { z } from "zod";

const router = express.Router();

router
  .get("/", async (req, res) => {
    const authRequest = auth.handleRequest(req, res);

    const session = await authRequest.validate(); // or `authRequest.validateBearerToken()`

    if (!session) {
      return res.status(401).send({ message: "Un" });
    }
    const user = session.user;
    const userId = user.userId;
    console.log(userId);
    const myVisits = await Visit.find()
      .populate("service", "title")
      .populate("place", "title");

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
          status: z.enum(visitStatutes),
        })
        .transform(({ _id, ...item }) => ({
          id: _id,
          ...item,
        }))
    );
    const visits = await usersInfoSchema.parseAsync(myVisits);

    await res.status(200).json({
      success: true,
      items: visits,
    });
  })
  .post("/", async (req, res) => {
    const { serviceId, placeId } = req.body;
    const authRequest = auth.handleRequest(req, res);

    const session = await authRequest.validate(); // or `authRequest.validateBearerToken()`

    if (!session) {
      return res.status(401).send({ message: "Un" });
    }
    const user = session.user;
    const userId = user.userId;

    try {
      const myVisit = await Visit.create({
        _id: new mongoose.Types.ObjectId(),
        visitDate: new Date(),
        service: serviceId,
        place: placeId,
        user: userId,
      });
      console.log("myVisits", myVisit);
      await res.status(200).json({ success: true, items: "myVisits" });
    } catch (error) {
      console.log(error);
      await res.status(200).json({ success: true, items: "myVisits" });
    }
  });

export default router;
