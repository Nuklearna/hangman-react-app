import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/configureStore.js';
import Hangman from './components/Hangman';

ReactDOM.render(
    <Provider store={store}>
        <Hangman />
    </Provider>,
    document.getElementById('root')
);
