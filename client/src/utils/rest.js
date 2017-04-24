import axios from 'axios';
import configGlobal from '../../../config/global';

var rest = axios.create({
    baseURL: `http://localhost:${configGlobal.app.port}/`,
    timeout: 1000
});

export default rest;

export const {get} = rest;
