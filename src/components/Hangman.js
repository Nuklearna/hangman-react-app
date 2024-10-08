import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchQuote, handleGuess, resetGame, setGameOver, setPlaying, postHighScore, fetchHighScores } from '../actions';
import { Modal, Button } from 'react-bootstrap';
import './Hangman.scss';

// Import images for different error stages
import err0 from '../images/hangman-0.svg';
import err1 from '../images/hangman-1.svg';
import err2 from '../images/hangman-2.svg';
import err3 from '../images/hangman-3.svg';
import err4 from '../images/hangman-4.svg';
import err5 from '../images/hangman-5.svg';
import err6 from '../images/hangman-6.svg';

class Hangman extends Component {
    static defaultProps = {
        maxErrors: 6, // Maximum number of wrong guesses
        images: [err0, err1, err2, err3, err4, err5, err6] // Array of images for each error count
    }

    constructor(props) {
        super(props);
        this.state = {
            userName: '',  // Handle user name input
            showModal: false, // State to handle modal visibility
            gameOverTriggered: false // Flag to ensure game-over logic is only called once
        };
    }

    componentDidMount() {
        this.props.fetchHighScores();  // Fetch high scores when component mounts
    }

    componentDidUpdate(prevProps) {
        const { gameStatus, correctGuesses, error } = this.props;
        const { gameOverTriggered, userName } = this.state;

           // Trigger the modal when the game is over (either win or lose) and only once
        if (gameStatus === 'gameOver' && !gameOverTriggered) {
            this.setState({ showModal: true, gameOverTriggered: true });
        }

        // Ensure reset when the game is restarted
        if (gameStatus !== 'gameOver' && prevProps.gameStatus === 'gameOver') {
            this.setState({ gameOverTriggered: false, showModal: false });
        }

        // If the game is over (either win or lose) and the gameOver logic hasn't been triggered yet
        if (gameStatus === 'gameOver' && !gameOverTriggered) {
            const wrongGuesses = error;
            const score = Math.max((correctGuesses - wrongGuesses) * 10, 0);  // Simple score calculation

            // Post high score when game is over
            this.props.postHighScore(userName, correctGuesses, wrongGuesses, score)
                .then(() => {
                    this.setState({ showModal: true });
                })
                .catch(error => {
                    console.error("Error posting high score:", error);
                });

            // Mark the game-over logic as triggered to prevent future calls
            this.setState({ gameOverTriggered: true });
        }
    }

    handleNameSubmit = async () => {
        if (this.state.userName.trim() !== '') {
            await this.props.fetchQuote();  // Fetch the quote once the username is entered
            this.props.setPlaying();        // Set game to "playing"
            this.setState({ gameOverTriggered: false });  // Reset game-over trigger for the new game
        } else {
            alert('Enter your name');
        }
    }

    handleGuess = (letter) => {
        this.props.handleGuess(letter);
    }

    resetGame = () => {
        this.props.resetGame();  // Reset the game
        this.setState({ userName: '', showModal: false, gameOverTriggered: false });
    }

    guessedQuote() {
        const { answer, guessed } = this.props;
        if (!answer) return '';  // Ensure answer exists
    
        // Map over each character in the answer
        return answer.split('').map(char => {
            if (/[a-zA-Z]/.test(char)) { // If it's a letter
                // Check guesses case-insensitively, but return the original case of the letter
                return guessed.has(char.toLowerCase()) ? char : '_';
            } else if (char === ' ') {
                return '\u00A0';  // Use non-breaking space for spaces between words
            } else {
                return char; // Keep punctuation and special characters unchanged
            }
        }).join('');  // Join characters without adding extra spaces between letters
    }

    checkForWin() {
        const { answer, guessed } = this.props;

        // Check if all letters in the answer have been guessed
        return answer.split('').every(char => {
            return guessed.has(char) || !/[a-zA-Z]/.test(char);
        });
    }

    generateButtons() {
        const { guessed, gameStatus } = this.props;

        if (gameStatus === 'gameOver') {
            return null;  // Don't show buttons when the game is over
        }

        return (
            "abcdefghijklmnopqrstuvwxyz".split("").map(letter => (
                <button className='button btn'
                    key={letter}
                    onClick={() => this.handleGuess(letter)}
                    disabled={guessed.has(letter)}
                >
                    {letter}
                </button>
            ))
        );
    }

    renderGame() {
        const {error, maxErrors, gameStatus, images } = this.props;
        const gameOver = error >= maxErrors;
        const isWin = this.checkForWin();  // Check if the player has won

        // Determine the correct image based on the current error count
        const hangmanImage = images[error];

        // Check if the game is won or lost
        if ((gameOver || isWin) && gameStatus !== 'gameOver') {
            this.props.setGameOver();  // Update the game state to 'gameOver'
        }

        return (
            <div className="container mt-5">
                    <h1 className="text-center h1">The Hangman Game </h1>
                    <div className="row mt-5">
                        <div className='col-sm-6'>
                            <div className="text-center">
                                <div className="username-name"> <b>Username:</b> {this.state.userName}</div>
                                <div className="hangman-image">
                                    <img src={hangmanImage} alt={`Error stage ${error}`} />
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="text-center">
                                <h2 className='h2'>Guess the quote:</h2>
                                <div className="quote-display">
                                   {this.guessedQuote()}
                                </div>
                                <div className="status mb-2">
                                    {gameOver ? (
                                            <span className="status-lost"> Hey, {this.state.userName} you lost! Give it another try.</span>
                                        ) : isWin ? (
                                            <span className="status-won"> Hey, {this.state.userName} you won! Let's play another round.</span>
                                        ) : (
                                            <span className="status-guess"><b>Wrong guesses:</b> {error} of {maxErrors}</span>
                                    )}
                                </div>
                                <div className="buttons">{this.generateButtons()}</div>
                                    {(gameOver || isWin) && (
                                        <button className='button btn' onClick={this.resetGame}>Reset</button>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>

        );
    }

    renderHighScores() {
        const { highScores } = this.props;
    
        // Ensure highScores are fetched and rendered only once
        return (
            <Modal show={this.state.showModal} onHide={() => this.setState({ showModal: false })}>
                <Modal.Header closeButton>
                    <Modal.Title>High Scores</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {highScores && highScores.length > 0 ? (
                        <ul>
                            {highScores
                                .sort((a, b) => b.score - a.score)  // Sort high scores by score (highest first)
                                .map((score, index) => (
                                    <li key={index}>
                                        {score.userName}: {score.score} points, Correct: {score.correctGuesses}, Wrong: {score.wrongGuesses}
                                    </li>
                                ))
                            }
                        </ul>
                    ) : (
                        <p>No high scores available yet.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.setState({ showModal: false })}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
    

    render() {
        const { gameStatus } = this.props;
        const { userName } = this.state;

        return (
            <div>
                {gameStatus === 'start' ? (
                    <div className="container mt-5 start-container">
                        <h1 className="text-center h1">The Hangman Game</h1>
                        <div className="w-50 container">
                            <div className="text-center d-grid gap-3">
                                <h2 className="text-center h2">Enter your name to start the game</h2>
                                <input className='p-1 border border-1'
                                    type="text"
                                    placeholder="Enter your name"
                                    value={userName}
                                    onChange={(e) => this.setState({ userName: e.target.value })}
                                />
                                <button className='start-button btn' onClick={this.handleNameSubmit}>Start</button>
                            </div>
                        </div>
                    </div>
                ) : this.renderGame()}

                {this.renderHighScores()}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    answer: state.game.answer,
    guessed: state.game.guessed,
    error: state.game.error,
    correctGuesses: state.game.correctGuesses,
    gameStatus: state.game.gameStatus,
    maxErrors: state.game.maxErrors,
    highScores: state.game.highScores
});

export default connect(mapStateToProps, { fetchQuote, handleGuess, resetGame, setGameOver, setPlaying, postHighScore, fetchHighScores })(Hangman);
