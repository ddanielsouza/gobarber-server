import 'reflect-metadata';
import 'express-async-errors';
import 'dotenv/config';

import express, { Response, Request, NextFunction } from 'express';
import cors from 'cors';
import net from 'net';
import { errors } from 'celebrate';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import rageLimiter from '@shared/infra/http/middlewares/rageLimiter';
import routes from './routes';
import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));

app.use(rageLimiter);

app.use(routes);
app.use(errors());

app.use((err: Error, _request: Request, response: Response, _next: NextFunction) => {
   if (err instanceof AppError) {
      return response.status(err.statusCode).json({
         status: 'error',
         message: err.message,
      });
   }

   console.error(err);

   return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
   });
});

app.all('/', (request, response) => {
   const currentDate = new Date();
   return response.json({ message: `App is running ${currentDate.toJSON()}` });
});

const listener = app.listen(3333, () => {
   const { port } = listener.address() as net.AddressInfo;
   console.log(`Server started on port ${port}`);
});
