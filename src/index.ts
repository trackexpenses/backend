import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { InversifyExpressServer } from 'inversify-express-utils';
import config from './config';
import "./controllers";
import { container } from './container';

const app = express();

app.use(cors());
app.use(express.json());

const server = new InversifyExpressServer(container, null, { rootPath: '' }, app);

server.build().listen(config.port, () => {
  console.log('Server listening on port ' + config.port);
});
