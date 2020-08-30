import { Router } from 'express';
import multer from 'multer';
import CreateUserServices from '../services/CreateUserServices';
import ensureAuthenticate from '../middlewares/ensureAuthenticated';
import uploadConfig from '../config/upload';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

const usersRouter = Router();

const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
   const { name, email, password } = request.body;

   const user = await new CreateUserServices().execute({
      name,
      email,
      password,
   });

   delete user.password;

   return response.json(user);
});

usersRouter.patch(
   '/avatar',
   ensureAuthenticate,
   upload.single('avatar'),
   async (request, response) => {
      const updateUserAvatar = new UpdateUserAvatarService();

      const user = await updateUserAvatar.execute({
         user_id: request.user.id,
         avatarFileName: request.file.filename,
      });

      delete user.password;
      return response.json(user);
   },
);

export default usersRouter;
