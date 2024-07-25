import { combineReducers } from 'redux';
import {
    FETCH_QUOTE,
    HANDLE_GUESS,
    RESET_GAME,
    SET_GAME_OVER,
    POST_HIGH_SCORE,
    FETCH_HIGH_SCORES,
    FETCH_HIGH_SCORES_SUCCESS,
    POST_HIGH_SCORE_SUCCESS
} from '../actions/index';

const initialState = {
    answer: '',
    error: 0,
    guessed: new Set(),
    gameStatus: 'playing',
    userName: '',
    quoteId: '',
    highScores: []
};

const gameReducer = (state = initialState, action) => {
    switch(action.type) {
        case FETCH_QUOTE:
            return {
                ...state,
                answer: action.payload.content,
                quoteId: action.payload._id,
                error: 0,
                guessed: new Set(),
                gameStatus: 'playing'
            };
        case HANDLE_GUESS:
            const letter = action.payload;
            const guessed = new Set(state.guessed).add(letter);
            const error = state.answer.toLowerCase().includes(letter) ? state.error : state.error + 1;
            return {
                ...state,
                guessed,
                error
            };
        case RESET_GAME:
            return {
                ...state,
                error: 0,
                guessed: new Set(),
                gameStatus: 'playing'
            };
        case SET_GAME_OVER:
            return {
                ...state,
                gameStatus: 'gameover'
            };
        case POST_HIGH_SCORE:
            return {
                ...state,
                highScores: [...state.highScores, action.payload]
            };
        case FETCH_HIGH_SCORES:
            return {
                ...state,
                highScores: action.payload
            };
        case FETCH_HIGH_SCORES_SUCCESS:
            return {
                    ...state,
                    highScores: action.payload
            };
        case POST_HIGH_SCORE_SUCCESS:
             return {
                ...state,
                highScores: [...state.highScores, action.payload]
            };
        default:
            return state;
    }
};

export default combineReducers({
    game: gameReducer
});
