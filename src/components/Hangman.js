import React, {Component} from "react";
import axios from 'axios';
import './Hangman.css';
//import {Quote}  from './Quote';


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
                error: 0,
                guessed: new Set([]),
                answer: ""
            }
    }

    componentDidMount() {
        axios.get(`https://api.quotable.io/random`)
          .then(res => {
            const answer = res.data.content;
            this.setState({ answer });
          });
      }

     guessedQuote() {
        return this.state.answer.split('').map(letter => (this.state.guessed.has(letter) ? letter : ' _'));
     }

    handleGuess = e => {
        let letter = e.target.value;
        this.setState(st => ({
            guessed: st.guessed.add(letter),
            error: st.error + (st.answer.includes(letter) ? 0 : 1)
        }
        ));
    }

    generateButtons() {
        return "abcdefghijklmnopqrstuvwxyz".split("").map(letter => (
            <button className="btn btn-lg btn-primary m-2" key={letter} value={letter} onClick={this.handleGuess} disabled={this.state.guessed.has(letter)}>
                {letter}
            </button>
        ));
    }

    resetButton = () => {
        this.setState({
          error: 0,
          guessed: new Set([]),
          answer: ""
        });
      }


    render(){
        const gameOver = this.state.error >= this.props.maxErrors;
        let gameStat = this.generateButtons();
        const isWin = this.guessedQuote().join("") === this.state.answer;

        if (isWin) {
            gameStat = "You Won!"
        }
      
        if (gameOver) {
            gameStat = "You Lost!"
        }

        return (
            <div className="container">
                <h1 className="text-center">This is hangman game</h1>
      
                <div className="float-right">Wrong guesses: {this.state.error} of {this.props.maxErrors}</div>
                <div className="text-center">
                    <img src={this.props.images[this.state.error]} alt="Hangman"/>
                </div>
                <div className="text-center">
                    <p>Guess the quote:</p>
                    <p>
                        {!gameOver ? this.guessedQuote() : this.state.answer}
                    </p> 
                    <p>{gameStat}</p>
                    <button className='btn btn-info' onClick={this.resetButton}>Reset</button>
                </div>
            </div>
        )
    }


}

export default Hangman;