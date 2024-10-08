import axios from 'axios';

export const FETCH_QUOTE_SUCCESS = 'FETCH_QUOTE_SUCCESS';
export const FETCH_QUOTE_ERROR = 'FETCH_QUOTE_ERROR';
export const HANDLE_GUESS = 'HANDLE_GUESS';
export const RESET_GAME = 'RESET_GAME';
export const SET_GAME_OVER = 'SET_GAME_OVER';
export const SET_PLAYING = 'SET_PLAYING';
export const FETCH_HIGH_SCORES_SUCCESS = 'FETCH_HIGH_SCORES_SUCCESS';
export const POST_HIGH_SCORE_SUCCESS = 'POST_HIGH_SCORE_SUCCESS';

const API_KEY = 'F7MCvH0XZu/xYNXzSD4AeA==9mcrxvhWznCw2IAR'
const API_URL = 'https://my-json-server.typicode.com/stanko-ingemark/hang_the_wise_man_frontend_task/highscores';

// Fetch the quote from the API
export const fetchQuote = () => async dispatch => {
    try {
        const response = await axios.get('https://api.api-ninjas.com/v1/quotes?category=happiness', {
            headers: {
                'X-Api-Key': API_KEY,
            }
        });
        const quote = response.data[0].quote;
        dispatch({ type: FETCH_QUOTE_SUCCESS, payload: quote });
    } catch (error) {
        dispatch({ type: FETCH_QUOTE_ERROR, payload: error.message });
    }
};
export const handleGuess = letter => ({
    type: HANDLE_GUESS,
    payload: letter
});

// Set the game to "playing" state
export const setPlaying = () => ({
    type: SET_PLAYING
});

export const resetGame = () => ({
    type: RESET_GAME
});

export const setGameOver = () => ({
    type: SET_GAME_OVER
});

// Post high score to the API
export const postHighScore = (userName, correctGuesses, wrongGuesses, score) => async dispatch => {
    try {
        const highScore = {
            userName,
            correctGuesses,
            wrongGuesses,
            score,
            date: new Date().toISOString()
        };

        const response = await axios.post(API_URL, highScore);
        dispatch({ type: POST_HIGH_SCORE_SUCCESS, payload: response.data });
    } catch (error) {
        console.error('Error posting high score:', error);
    }
};

// Fetch high scores from the API
export const fetchHighScores = () => async dispatch => {
    try {
        const response = await axios.get(API_URL);
        dispatch({ type: FETCH_HIGH_SCORES_SUCCESS, payload: response.data });
    } catch (error) {
        console.error('Error fetching high scores:', error);
    }
};