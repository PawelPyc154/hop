import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { User } from '@interfaces/users.interface';
import { UserService } from '@services/users.service';

export class UserController {
  public user = Container.get(UserService);

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData: User[] = await this.user.findAllUser();

      res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const findOneUserData: User = await this.user.findUserById(userId);

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.body;
      const createUserData: User = await this.user.createUser(userData);

      res.status(201).json({ data: createUserData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const userData: User = req.body;
      const updateUserData: User = await this.user.updateUser(userId, userData);

      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const deleteUserData: User = await this.user.deleteUser(userId);

      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

// const router = express.Router();

// router
//   .get("/", async (req, res) => {
//     const authRequest = auth.handleRequest(req, res);

//     const session = await authRequest.validate(); // or `authRequest.validateBearerToken()`

//     if (!session) {
//       return res.status(401).send({ message: "Un" });
//     }
//     const user = session.user;
//     const userId = user.userId;
//     console.log(userId);
//     const myVisits = await Visit.find()
//       .populate("service", "title")
//       .populate("place", "title");

//     const usersInfoSchema = z.array(
//       z
//         .object({
//           _id: z.string(),
//           visitDate: z.date(),
//           service: z
//             .object({ title: z.string() })
//             .transform((item) => item.title),

//           place: z
//             .object({ title: z.string() })
//             .transform((item) => item.title),
//           status: z.enum(visitStatutes),
//         })
//         .transform(({ _id, ...item }) => ({
//           id: _id,
//           ...item,
//         }))
//     );
//     const visits = await usersInfoSchema.parseAsync(myVisits);

//     await res.status(200).json({
//       success: true,
//       items: visits,
//     });
//   })
// .post("/", async (req, res) => {
//   const { serviceId, placeId } = req.body;
//   const authRequest = auth.handleRequest(req, res);

//   const session = await authRequest.validate(); // or `authRequest.validateBearerToken()`

//   if (!session) {
//     return res.status(401).send({ message: "Un" });
//   }
//   const user = session.user;
//   const userId = user.userId;

//   try {
//     const myVisit = await Visit.create({
//       _id: new mongoose.Types.ObjectId(),
//       visitDate: new Date(),
//       service: serviceId,
//       place: placeId,
//       user: userId,
//     });
//     console.log("myVisits", myVisit);
//     await res.status(200).json({ success: true, items: "myVisits" });
//   } catch (error) {
//     console.log(error);
//     await res.status(200).json({ success: true, items: "myVisits" });
//   }
// });
