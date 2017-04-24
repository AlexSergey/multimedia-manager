import { search } from '../../utils/elastic';
import { get } from '../../utils/rest';
import { CATEGORIES, CAMERAS } from './urls';

export const getPhotos = (query, size, offset) => {
    console.log(query, size, offset);
    return search({
        q: query,
        size: size,
        from: (offset || 0) * size,
    }).then(data => Object.assign(data, {size, offset}))
};

export const sortByColor = (color, size, offset) => {
    var query = {
        "bool": {
            "must": [
                {"range": {
                    "colors.r" : {
                        "gte": color.r - color.r*.1,
                        "lte": color.r + color.r*.1
                    }
                }},
                {"range" : {
                    "colors.g" :  {
                        "gte" :color.g - color.g*.1,
                        "lte" :color.g + color.g*.1
                    }
                }},
                {"range" : {
                    "colors.b" :  {
                        "gte" :color.b - color.b*.1,
                        "lte" :color.b + color.b*.1
                    }
                }}
            ]
        }
    };

    return search({
        body: {
            size: size,
            from: (offset || 0) * size,
            query: query
        }
    }).then(data => Object.assign(data, {size, offset}));
};

export const resetFilters = (size, offset) => {
    var query = {
        "match_all": {}
    };

    return search({
        body: {
            size: size,
            from: (offset || 0) * size,
            query: query
        }
    }).then(data => Object.assign(data, {size, offset}));
};

export const getCategories = () => get(CATEGORIES);

export const getCameras = () => get(CAMERAS);