import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import configGlobal from '../../config/global';

export default function(app, express, router) {
    app.use('/photos', express.static(configGlobal.photos.path));
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use('/', router);
}
