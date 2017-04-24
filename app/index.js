import express, {Router} from 'express';
import {createServer} from 'http';
import configApp from './config/app';
import configRouter from './config/router';
import configGlobal from '../config/global';
import routing from './routing';
import Elasticsearch from './libs/Elasticsearch';
import photoSchema from './controllers/photos/schema';

const app = express();
const router = Router();

const server = createServer(app);

const photoFinder = new Elasticsearch({
    url: `${configGlobal.elasticsearch.host}:${configGlobal.elasticsearch.port}`,
    indexname: configGlobal.photos.db.index,
    doctype: configGlobal.photos.db.docType,
    schema: photoSchema
});

configApp(app, express, router);
configRouter(router);
routing(router, photoFinder);

server.listen(configGlobal.app.port, function() {
    console.log(`server is running on ${configGlobal.app.port} port`);
});


