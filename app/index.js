import express, {Router} from 'express';
import {createServer} from 'http';
import configApp from './config/app';
import configRouter from './config/router';

const app = express();
const router = Router();

const server = createServer(app);

configApp(app, express, router);
configRouter(router);

server.listen(3020, function() {
    console.log('server is running on ' + 3020 + ' port');
});
