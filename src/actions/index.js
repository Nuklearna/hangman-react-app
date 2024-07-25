import axios from 'axios';

const API_URL = 'https://my-json-server.typicode.com/stanko-ingemark/hang_the_wise_man_frontend_task/highscores';

export const FETCH_QUOTE = 'FETCH_QUOTE';
export const HANDLE_GUESS = 'HANDLE_GUESS';
export const RESET_GAME = 'RESET_GAME';
export const SET_GAME_OVER = 'SET_GAME_OVER';
export const POST_HIGH_SCORE = 'POST_HIGH_SCORE';
export const FETCH_HIGH_SCORES = 'FETCH_HIGH_SCORES';

export const FETCH_HIGH_SCORES_SUCCESS = 'FETCH_HIGH_SCORES_SUCCESS';
export const POST_HIGH_SCORE_SUCCESS = 'POST_HIGH_SCORE_SUCCESS';

export const fetchQuote = () => async dispatch => {
    try {
        const response = await axios.get('https://api.quotable.io/random');
        dispatch({
            type: FETCH_QUOTE,
            payload: response.data
        });
    } catch (error) {
        console.error('Failed to fetch quote:', error);
    }
};

export const handleGuess = letter => ({
    type: HANDLE_GUESS,
    payload: letter
});

export const resetGame = () => ({
    type: RESET_GAME
});

export const setGameOver = () => ({
    type: SET_GAME_OVER
});

export const fetchHighScores = () => async dispatch => {
    try {
        const response = await axios.get(API_URL);
        dispatch({
            type: FETCH_HIGH_SCORES_SUCCESS,
            payload: response.data
        });
    } catch (error) {
        console.error('Error fetching high scores:', error);
    }
};

export const postHighScore = (quoteId, length, uniqueCharacters, userName, error, duration, score) => async dispatch => {
    try {
        const highScore = {
            quoteId,
            length,
            uniqueCharacters,
            userName,
            error,
            duration,
            score
        };
        const response = await axios.post(API_URL, highScore);
        dispatch({
            type: POST_HIGH_SCORE_SUCCESS,
            payload: response.data
        });
    } catch (error) {
        console.error('Error posting high score:', error);
    }
};
