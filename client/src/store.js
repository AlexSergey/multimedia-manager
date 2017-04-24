import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import {createLogger} from 'redux-logger';
import photos from './containers/Photos/reducer';

var finalCreateStore = compose(
    applyMiddleware(
        createLogger({
            collapsed: true
        })
    ),
    !!window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

var store = finalCreateStore(combineReducers({
    photos
}));

export default store;