import React, { Component } from "react";
import { connect } from 'react-redux';
import { fetchQuote, handleGuess, resetGame, setGameOver, postHighScore, fetchHighScores } from '../actions';
import { smarter } from '../utils/score';
import { Modal, Button } from 'react-bootstrap';
import './Hangman.css';

import err0 from '../images/hangman-0.svg';
import err1 from '../images/hangman-1.svg';
import err2 from '../images/hangman-2.svg';
import err3 from '../images/hangman-3.svg';
import err4 from '../images/hangman-4.svg';
import err5 from '../images/hangman-5.svg';
import err6 from '../images/hangman-6.svg';

class Hangman extends Component {
    static defaultProps = {
        maxErrors: 6,
        images: [err0, err1, err2, err3, err4, err5, err6]
    }

    constructor(props) {
        super(props);
        this.state = {
            userName: "",  // Handle user name input
            stage: 'start', // Stage to control game flow
            showModal: false // State to handle modal visibility
        };
        this.startTime = null; // Track start time
    }

    componentDidMount() {
        this.props.fetchHighScores();
    }

    componentDidUpdate(prevProps) {
        // Check if game status has changed to 'gameOver'
        if (this.props.gameStatus === 'gameOver' && prevProps.gameStatus !== 'gameOver') {
            this.gameOverLogic();
        }
    }

    handleNameSubmit = () => {
        if (this.state.userName.trim() !== '') {
            this.props.fetchQuote();
            this.setState({ stage: 'playing', startTime: new Date() });
        }
    }

    handleGuess = (letter) => {
        this.props.handleGuess(letter.toLowerCase()); // Ensure lower case is used
    }

    resetGame = () => {
        this.props.resetGame();
        this.setState({ userName: "", stage: 'start', showModal: false }); // Reset local state
    }

    gameOverLogic = () => {
        const { answer, error, userName, quoteId } = this.props;
        const duration = new Date() - this.startTime;
        const length = answer.length;
        const uniqueCharacters = new Set(answer.toLowerCase().replace(/[^a-z]/g, '')).size;
        const score = smarter(length, uniqueCharacters, error, duration);

        this.props.postHighScore(quoteId, length, uniqueCharacters, userName, error, duration, score)
            .then(() => {
                this.props.fetchHighScores();
                this.setState({ showModal: true }); // Show modal after posting high score
            })
            .catch(error => {
                console.error("Error posting high score:", error);
            });
    }

    generateButtons() {
        const { guessed } = this.props;  // Destructure for easier access
        return "abcdefghijklmnopqrstuvwxyz".split("").map(letter => (
            <button className="btn btn-light m-2"
                key={letter}
                value={letter}
                onClick={() => this.handleGuess(letter)}
                disabled={guessed && guessed.has(letter.toLowerCase())}  // Safety check added
            >
                {letter}
            </button>
        ));
    }

    guessedQuote() {
        const { answer, guessed } = this.props;
        return answer.split('').map(letter => {
            if (/[a-zA-Z]/.test(letter)) {
                return guessed.has(letter.toLowerCase()) ? letter : '_ ';
            } else {
                return letter;
            }
        }).join('');
    }

    renderGame() {
        const { answer, error } = this.props;
        const gameOver = error >= this.props.maxErrors;
        let gameStat = this.generateButtons();
        const isWin = this.guessedQuote().trim() === answer.trim();

        if (isWin) {
            gameStat = "You Won!";
        }

        if (gameOver) {
            gameStat = "You Lost!";
        }

        return (
            <div className="container w-50 mt-5">
                <h1 className="text-center">This is hangman game</h1>
                <div className="float-right">Wrong guesses: {error} of {this.props.maxErrors}</div>
                <div className="float-right">Username: {this.state.userName}</div>
                <div className="text-center">
                    <img src={this.props.images[error]} alt="Hangman"/>
                </div>
                <div className="text-center">
                    <p>Guess the quote:</p>
                    <p>
                        {!gameOver ? this.guessedQuote() : answer}
                    </p>
                    <p>{gameStat}</p>
                    <button className='btn btn-info border border-1 text-light' onClick={this.resetGame}>Reset</button>
                </div>
            </div>
        );
    }

    render() {
        const { stage, userName, showModal } = this.state;
        const { highScores } = this.props;
        
        return (
            <div>
                {stage === 'start' ? (
                <div className="container w-25 mt-5">
                    <h1 className="text-center">Enter your name to start the game</h1>
                    <div className="text-center d-grid gap-3">
                        <input className="p-1 border border-1"
                            type="text"
                            placeholder="Enter your name"
                            value={userName}
                            onChange={(e) => this.setState({ userName: e.target.value })}
                        />
                        <button className='btn btn-info border border-1 text-light' onClick={this.handleNameSubmit}>Start Game</button>
                    </div>
                </div>
            ): this.renderGame()}

            <Modal show={showModal} onHide={() => this.setState({ showModal: false })}>
                <Modal.Header closeButton>
                    <Modal.Title>High Scores</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul>
                        {highScores.map((score, index) => (
                            <li key={index}>
                                {score.userName}: Score: {score.errors}, Duration: {score.duration}
                            </li>
                        ))}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.setState({ showModal: false })}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
    }
}

const mapStateToProps = state => ({
    answer: state.game.answer,
    error: state.game.error,
    guessed: state.game.guessed,
    gameStatus: state.game.gameStatus,
    userName: state.game.userName,
    quoteId: state.game.quoteId,
    highScores: state.game.highScores,
    length: state.game.answer.length,
    uniqueCharacters: new Set(state.game.answer.toLowerCase().replace(/[^a-z]/g, '')).size // Calculate unique characters
});

export default connect(mapStateToProps, { fetchQuote, handleGuess, resetGame, setGameOver, postHighScore, fetchHighScores })(Hangman);