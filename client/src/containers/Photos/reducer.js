import { Map, List } from 'immutable';

export default function(state = {
    photos: [],
    total: 0,
    offset: 0,
    size: 20
}, action) {
    switch (action.type) {
        case 'GET_PHOTOS':
            var photos = action.payload.photos.map(item => item._source);

            return Object.assign({}, state, {
                photos: photos,
                offset: parseInt(action.payload.offset),
                size: parseInt(action.payload.size),
                total: parseInt(action.payload.total)
            });
        default:
            return state;
    }
}