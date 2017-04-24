import Folder from './Folder';
import Image from './Image';
import configGlobal from '../../../config/global';
import each from 'async/each';
import {writeFileSync} from 'fs';
import iconv from 'iconv-lite';
import mkdirp from 'mkdirp';

export default function(photoFinder) {
    var cameras = {
        collection: new Set()
    };
    var categories = {
        collection: new Set()
    };

    return new Promise((resolve, reject) => {
        photoFinder.indexCreate()
            .then(() => {
                console.log('indexes created!');

                var parseFolder = new Folder({
                    types: configGlobal.photos.types
                });

                return parseFolder.getChildFiles(configGlobal.photos.path);
            })
            .then(files => {
                var imagesData = [];

                return new Promise((resolve, reject) => {
                    each(files, (file, cb) => {
                        var image = new Image({
                            path: file.path,
                            root: configGlobal.photos.path,
                            folder: file.folder
                        });
                        image.getImagedata()
                            .then(imagedata => {
                                if (!!imagedata.camera_model_name) {
                                    cameras.collection.add(imagedata.camera_model_name);
                                }
                                if (!!imagedata.category) {
                                    categories.collection.add(imagedata.category);
                                }

                                imagesData.push({"update":{"_id":imagedata.id}},{"doc": imagedata, "doc_as_upsert":true});
                                cb();
                            })
                            .catch(err => {
                                console.log(err);
                                cb();
                            });
                }, err => {
                    if(err) {
                        return reject(err);
                    } else {
                        return resolve(imagesData);
                    }
                });
            });
        })
        .then(imagesData => {
            return photoFinder.addItems(imagesData)
        })
        .then(() => {
            var _cameras = [];
            var _categories = [];
            cameras.collection.forEach(camera => {
                _cameras.push(camera);
            });
            categories.collection.forEach(category => {
                _categories.push(category);
            });
            cameras.collection = _cameras;
            categories.collection = _categories;

            mkdirp('./data/photos/', err => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                writeFileSync('./data/photos/cameras.json', iconv.encode(JSON.stringify(cameras), 'win1251'));
                writeFileSync('./data/photos/categories.json', iconv.encode(JSON.stringify(categories), 'win1251'));
                resolve('All images has been add to elasticsearch');
            });


        })
        .catch(reject);
    })

    /*

    return new Promise((resolve, reject) => {
        elasticsearch.indexCreate()
            .then(() => {
            console.log('indexes created!');
    var parseFolder = new Folder({
        types: config.types
    });
    return parseFolder.getChildFiles(config.folder);
})
    .then(files => {
        var imagesData = [];
    return new Promise((resolve, reject) => {
        each(files, (file, cb) => {
        var image = new Image({
            path: file.path,
            root: config.folder,
            folder: file.folder
        });
        image.getImagedata()
            .then(imagedata => {
            if (!!imagedata.camera_model_name) {
            cameras.collection.add(imagedata.camera_model_name);
        }
        if (!!imagedata.category) {
            categories.collection.add(imagedata.category);
        }

        imagesData.push({"update":{"_id":imagedata.id}},{"doc": imagedata, "doc_as_upsert":true});
        cb();
    })
    .catch(err => {
            console.log(err);
        cb();
    });
    }, err => {
        if( err ) {
            return reject(err);
        } else {
            return resolve(imagesData);
        }
    });
})
})
    .then(imagesData => {
        return elasticsearch.addItems(imagesData)
    })
    .then(() => {
        var _cameras = [];
    var _categories = [];
    cameras.collection.forEach(camera => {
        _cameras.push(camera);
});
    categories.collection.forEach(category => {
        _categories.push(category);
});
    cameras.collection = _cameras;
    categories.collection = _categories;

    fs.writeFileSync('./data/photos/cameras.json', iconv.encode(JSON.stringify(cameras), 'win1251'));
    fs.writeFileSync('./data/photos/categories.json', iconv.encode(JSON.stringify(categories), 'win1251'));
    resolve('All images has been add to elasticsearch');
})
    .catch(reject);
});*/
}
