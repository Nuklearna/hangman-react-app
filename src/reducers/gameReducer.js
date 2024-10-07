import {
    FETCH_QUOTE_SUCCESS,
    HANDLE_GUESS,
    RESET_GAME,
    SET_GAME_OVER,
    SET_PLAYING,
    POST_HIGH_SCORE_SUCCESS,
    FETCH_HIGH_SCORES_SUCCESS
} from '../actions';

const initialState = {
    answer: '',            // The quote to guess
    guessed: new Set(),     // Set of guessed letters
    error: 0,               // Number of incorrect guesses
    correctGuesses: 0,      // Number of correct guesses
    maxErrors: 6,           // Maximum allowed errors
    gameStatus: 'start',    // start, playing, gameOver
    quoteFetched: false,    // Tracks if the quote is successfully fetched
    highScores: []          // Array of high scores
};

const gameReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_QUOTE_SUCCESS:
            return {
                ...state,
                answer: action.payload,  // Store the fetched quote in lowercase
                guessed: new Set(),                   // Reset guessed letters
                error: 0,                             // Reset errors
                correctGuesses: 0,                    // Reset correct guesses
                gameStatus: 'playing',                // Set game state to "playing"
                quoteFetched: true
            };

        case HANDLE_GUESS:
            const { payload: letter } = action;
            const { answer, guessed, error, correctGuesses, maxErrors } = state;

            const newGuessed = new Set(guessed).add(letter);
            const isCorrectGuess = answer.includes(letter);
            const newCorrectGuesses = isCorrectGuess ? correctGuesses + 1 : correctGuesses;
            const newError = isCorrectGuess ? error : error + 1;

            const isGameOver = newError >= maxErrors || [...answer].every(char => newGuessed.has(char) || !/[a-zA-Z]/.test(char));

            return {
                ...state,
                guessed: newGuessed,
                error: newError,
                correctGuesses: newCorrectGuesses,
                gameStatus: isGameOver ? 'gameOver' : 'playing'
            };

        case SET_PLAYING:
            return {
                ...state,
                gameStatus: 'playing'
            };

        case RESET_GAME:
            return {
                ...state,
                guessed: new Set(),
                error: 0,
                correctGuesses: 0,
                gameStatus: 'start',
                quoteFetched: false
            };

        case SET_GAME_OVER:
            return {
                ...state,
                gameStatus: 'gameOver'
            };

        case POST_HIGH_SCORE_SUCCESS:
            return {
                ...state,
                highScores: [...state.highScores, action.payload]
            };

        case FETCH_HIGH_SCORES_SUCCESS:
            return {
                ...state,
                highScores: action.payload
            };

        default:
            return state;
    }
};

export default gameReducer;