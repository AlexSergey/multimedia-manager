module.exports = {
    elasticsearch: {
        host: 'http://localhost',
        port: 9200,
        config: './config/elasticsearch'
    },
    photos: {
        path: '/media/F/test/',
        db: {
            index: 'photos',
            docType: 'photo'
        },
        types: ['.jpg']
    },
    app: {
        port: 3200
    }
};
