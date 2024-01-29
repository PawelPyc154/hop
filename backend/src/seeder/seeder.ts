import { faker } from "@faker-js/faker";

import mongoose from "mongoose";
import { placeCategories } from "../interfaces/place.interface";
import { dbConnection } from "../database";
import { PlaceModel } from "../models/place.model";
import { ServiceModel } from "../models/service.model";

dbConnection();

const importData = async () => {
  try {
    const places = Array.from({ length: 50 }, (item, index) => {
      return new PlaceModel({
        _id: new mongoose.Types.ObjectId(),
        title: faker.lorem.sentence(2),
        description: faker.lorem.sentence(50),
        category: faker.helpers.arrayElement(Object.values(placeCategories)),
        image: `https://picsum.photos/id/${index}/400/400`,
      });
    });

    const _ids = places.map((item) => item._id);

    const service = Array.from({ length: 500 }, () => ({
      _id: new mongoose.Types.ObjectId(),
      title: faker.lorem.sentence(4),
      price: faker.number.float({ min: 10, max: 500, precision: 10 }),
      place: faker.helpers.arrayElement(_ids),
    })).map((v) => new ServiceModel(v));

    places.forEach((category) =>
      service.map((expense) => {
        // @ts-expect-error
        if (expense.place?.equals(category._id)) {
          // @ts-expect-error
          category.services.push(expense._id);
        }
      })
    );

    await Promise.all(service.map((expense) => expense.save()));
    await Promise.all(places.map((category) => category.save()));

    console.log("Data Imported...");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await PlaceModel.deleteMany();
    await ServiceModel.deleteMany();

    console.log("Data Destroyed...");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
