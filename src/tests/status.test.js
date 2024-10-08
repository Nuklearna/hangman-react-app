import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';  
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Hangman from '../components/Hangman';

// Set up the mock store with thunk middleware
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

// Define the initial mock state for the store
const store = mockStore({
  game: {
    answer: 'Test',
    guessed: new Set(['t', 'e', 's']),
    error: 2,
    correctGuesses: 3,
    gameStatus: 'playing',
    maxErrors: 6,
  }
});

// Mock props for win and lose scenarios
const winProps = {
  answer: "Test",
  guessed: new Set(['t', 'e', 's']),
  error: 2,
  maxErrors: 6,
  gameStatus: 'playing',
  setGameOver: jest.fn(),
};

const loseProps = {
  answer: "Test",
  guessed: new Set(['x', 'y', 'z']),
  error: 6,
  maxErrors: 6,
  gameStatus: 'playing',
  setGameOver: jest.fn(),
};

// Test cases
describe('Hangman Win/Lose Logic', () => {
  test('should trigger win if all letters are guessed', () => {
    render(
      <Provider store={store}>
        <Hangman {...winProps} />
      </Provider>
    );

    // Check if the win message is displayed (test will fail because of state)
    const winMessage = screen.getByText((content, element) => content.includes('you won'));
    expect(winMessage).toBeInTheDocument();
  });

  test('should trigger game over if max errors are reached', () => {
    render(
      <Provider store={store}>
        <Hangman {...loseProps} />
      </Provider>
    );

    // Check if the lose message is displayed (test will fail because of state)
    const loseMessage = screen.getByText((content, element) => content.includes('you lost'));
    expect(loseMessage).toBeInTheDocument();
  });
});
