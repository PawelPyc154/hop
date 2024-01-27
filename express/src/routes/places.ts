import { Place } from "database";
import express from "express";

const router = express.Router();

router.get("/:category?", async (req, res) => {
  const category = req.params.category;

  const places = await Place.find({
    ...(category && { category: category }),
  }).populate("services");

  await res.status(200).json({ success: true, items: places });
});

export default router;
