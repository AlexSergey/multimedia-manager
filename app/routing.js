import photos from './controllers/photos';

export default function(router, photoFinder) {
    router.route('/api/photos/parse')
        .get((req, res) => photos(photoFinder)
            .then(msg => res.status(200).send(msg))
            .catch(err => res.status(500).send(err)));
}
