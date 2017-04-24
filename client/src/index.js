import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';
import './assets/spacing.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'react-select/dist/react-select.css';

ReactDOM.render(
    <Provider
        store={store}
        key="provider">
        <App />
    </Provider>,
    document.getElementById('root')
);
