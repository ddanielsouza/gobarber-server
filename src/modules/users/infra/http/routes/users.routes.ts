import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';
import { celebrate, Segments, Joi } from 'celebrate';
import ensureAuthenticate from '../middlewares/ensureAuthenticated';
import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';

const usersRouter = Router();

const upload = multer(uploadConfig);
const userController = new UsersController();
const userAvatarController = new UserAvatarController();
usersRouter.post(
   '/',
   celebrate({
      [Segments.BODY]: {
         name: Joi.string().required(),
         email: Joi.string().email().required(),
         password: Joi.string().required(),
         password_confirmation: Joi.string().required().valid(Joi.ref('password')),
      },
   }),
   userController.create,
);

usersRouter.patch(
   '/avatar',
   ensureAuthenticate,
   upload.single('avatar'),
   userAvatarController.update,
);

export default usersRouter;
