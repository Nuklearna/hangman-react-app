// reducers.js
import { FETCH_QUOTE, HANDLE_GUESS, RESET_GAME, SET_GAME_OVER, POST_HIGH_SCORE, FETCH_HIGH_SCORES, FETCH_HIGH_SCORES_SUCCESS, POST_HIGH_SCORE_SUCCESS } from '../actions';

const initialState = {
    answer: '',
    error: 0,
    guessed: new Set(),
    gameStatus: 'playing',
    userName: '',
    quoteId: null,
    highScores: []
};

const gameReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_QUOTE:
            return { ...state, answer: action.payload.quote, quoteId: action.payload.id };
        case HANDLE_GUESS:
            const guessed = new Set(state.guessed).add(action.payload);
            const error = state.answer.toLowerCase().includes(action.payload) ? state.error : state.error + 1;
            return { ...state, guessed, error };
        case RESET_GAME:
            return initialState;
        case SET_GAME_OVER:
            return { ...state, gameStatus: 'gameOver' };
        case POST_HIGH_SCORE:
            return { ...state, highScores: [...state.highScores, action.payload] };
        case FETCH_HIGH_SCORES:
            return { ...state, highScores: action.payload };
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

export default gameReducer;
