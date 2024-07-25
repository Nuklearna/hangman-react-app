import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'; // Here is the correct named import
import rootReducer from '../reducers';


const configureStore = () => {
    return createStore(
        rootReducer,
        applyMiddleware(thunk) // Apply middleware correctly
    );
};

export default configureStore;