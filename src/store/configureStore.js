import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import gameReducer from '../reducers/gameReducer';

const rootReducer = combineReducers({
    game: gameReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));


export default store;