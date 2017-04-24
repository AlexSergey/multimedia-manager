import configGlobal from '../../../config/global';
import elasticsearch from 'elasticsearch';

var client = new elasticsearch.Client({
    host: `${configGlobal.elasticsearch.host}:${configGlobal.elasticsearch.port}`,
});

export default client;

export const search = (q) => {
    var query = Object.assign({}, {index: configGlobal.photos.db.index}, q)
    return client.search(query);
}
