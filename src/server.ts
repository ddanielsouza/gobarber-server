import express from 'express';
import net from 'net';
import routes from './routes';

import './databases';

const app = express();

app.use(express.json());
app.use(routes);

app.all('/', (request, response) => {
   const currentDate = new Date();
   return response.json({ message: `App is running ${currentDate.toJSON()}` });
});

const listener = app.listen(3333, () => {
   const { port } = listener.address() as net.AddressInfo;
   console.log(`Server started on port ${port}`);
});
