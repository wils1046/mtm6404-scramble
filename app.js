/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

// Array of words for the game
const gameWords = [
  'javascript',
  'computer',
  'programming',
  'keyboard',
  'function',
  'variable',
  'browser',
  'website',
  'developer',
  'algorithm',
  'database',
  'network',
  'software',
  'hardware',
  'internet'
];

const WordScrambleGame = () => {
  const [gameState, setGameState] = React.useState('playing');
  const [currentWord, setCurrentWord] = React.useState('');
  const [scrambledWord, setScrambledWord] = React.useState('');
  const [remainingWords, setRemainingWords] = React.useState([]);
  const [points, setPoints] = React.useState(0);
  const [strikes, setStrikes] = React.useState(0);
  const [passes, setPasses] = React.useState(3);
  const [guess, setGuess] = React.useState('');
  const [message, setMessage] = React.useState('');

  const maxStrikes = 3;

  React.useEffect(() => {
    const savedState = loadGameState();
    if (savedState && savedState.gameState && savedState.currentWord) {
      setGameState(savedState.gameState);
      setCurrentWord(savedState.currentWord);
      setScrambledWord(savedState.scrambledWord);
      setRemainingWords(savedState.remainingWords);
      setPoints(savedState.points);
      setStrikes(savedState.strikes);
      setPasses(savedState.passes);
      setMessage('');
    } else {
      initializeGame();
    }
  }, []);

  React.useEffect(() => {
    const gameData = {
      gameState,
      currentWord,
      scrambledWord,
      remainingWords,
      points,
      strikes,
      passes
    };
    saveGameState(gameData);
  }, [gameState, currentWord, scrambledWord, remainingWords, points, strikes, passes]);

  const saveGameState = (data) => {
    try {
      localStorage.setItem('scramble_points', data.points.toString());
      localStorage.setItem('scramble_strikes', data.strikes.toString());
      localStorage.setItem('scramble_passes', data.passes.toString());
      localStorage.setItem('scramble_gameState', data.gameState);
      localStorage.setItem('scramble_currentWord', data.currentWord);
      localStorage.setItem('scramble_scrambledWord', data.scrambledWord);
      localStorage.setItem('scramble_remainingWords', JSON.stringify(data.remainingWords));
    } catch (e) {
      window.gameData = data;
    }
  };

  const loadGameState = () => {
    try {
      const points = localStorage.getItem('scramble_points');
      const strikes = localStorage.getItem('scramble_strikes');
      const passes = localStorage.getItem('scramble_passes');
      const gameState = localStorage.getItem('scramble_gameState');
      const currentWord = localStorage.getItem('scramble_currentWord');
      const scrambledWord = localStorage.getItem('scramble_scrambledWord');
      const remainingWords = localStorage.getItem('scramble_remainingWords');

      if (points && strikes && passes) {
        return {
          points: parseInt(points),
          strikes: parseInt(strikes),
          passes: parseInt(passes),
          gameState: gameState || 'playing',
          currentWord: currentWord || '',
          scrambledWord: scrambledWord || '',
          remainingWords: remainingWords ? JSON.parse(remainingWords) : []
        };
      }
      return '';
    } catch (e) {
      return window.gameData || '';
    }
  };

  const clearGameState = () => {
    try {
      localStorage.removeItem('scramble_points');
      localStorage.removeItem('scramble_strikes');
      localStorage.removeItem('scramble_passes');
      localStorage.removeItem('scramble_gameState');
      localStorage.removeItem('scramble_currentWord');
      localStorage.removeItem('scramble_scrambledWord');
      localStorage.removeItem('scramble_remainingWords');
    } catch (e) {
      window.gameData = '';
    }
  };

  const initializeGame = () => {
    // Clear previous game data
    clearGameState();
    
    const shuffledWords = shuffle(gameWords);
    const firstWord = shuffledWords[0];
    const remaining = shuffledWords.slice(1);
    
    setGameState('playing');
    setCurrentWord(firstWord);
    setScrambledWord(shuffle(firstWord));
    setRemainingWords(remaining);
    setPoints(0);
    setStrikes(0);
    setPasses(3);
    setGuess('');
    setMessage('');
  };

  const getNextWord = () => {
    if (remainingWords.length === 0) {
      setGameState('gameOver');
      setMessage('You won!');
      return;
    }

    const nextWord = remainingWords[0];
    const newRemaining = remainingWords.slice(1);
    
    setCurrentWord(nextWord);
    setScrambledWord(shuffle(nextWord));
    setRemainingWords(newRemaining);
  };

  const handleGuess = () => {
    if (!guess.trim() || gameState !== 'playing') return;

    const userGuess = guess.toLowerCase().trim();
    const correctAnswer = currentWord.toLowerCase();

    if (userGuess === correctAnswer) {
      // Correct guess
      const newPoints = points + 1;
      setPoints(newPoints);
      setMessage('Correct. Next word.');
      setGuess('');
      
      setTimeout(() => {
        getNextWord();
        setMessage('Guess the word!');
      }, 1500);
    } else {
      // Incorrect guess
      const newStrikes = strikes + 1;
      setStrikes(newStrikes);
      setMessage('Incorrect! Try again.');
      setGuess('');
      
      if (newStrikes >= maxStrikes) {
        setGameState('gameOver');
        setMessage('You lost.');
      }
    }
  };

  const handlePass = () => {
    if (passes <= 0 || gameState !== 'playing') return;

    const newPasses = passes - 1;
    setPasses(newPasses);
    setMessage('You passed. Next word.');
    setGuess('');
    
    setTimeout(() => {
      getNextWord();
      setMessage('Guess the word!');
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGuess();
    }
  };

  const playAgain = () => {
    initializeGame();
  };

  return (
    <div className="game-container">
      <h1>Welcome to Scramble.</h1>
      
      <div className="stats">
        <div className="stat-item">
          <div className="stat-number">{points}</div>
          <div className="stat-label">Points</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{strikes}</div>
          <div className="stat-label">Strikes</div>
        </div>
      </div>
      
      {(gameState === 'gameOver' && message === 'You lost.') && (
        <div className="game-over-message">
          {message}
        </div>
      )}
      
      {(gameState === 'gameOver' && message === 'You won!') && (
        <div className="game-win-message">
          {message}
        </div>
      )}
      
      {gameState === 'playing' ? (
        <div className={`message ${message.includes('Correct') ? 'correct' : message.includes('Incorrect') ? 'incorrect' : message.includes('passed') ? 'passed' : ''}`}>
          {message !== 'Guess the word!' ? message : ''}
        </div>
      ) : ''}
      
      {(gameState === 'playing' || gameState === 'gameOver') && (
        <>
          <div className="scrambled-word">{scrambledWord}</div>
          
          <div className="input-section">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder=""
              autoFocus={gameState === 'playing'}
              disabled={gameState === 'gameOver'}
            />
            <br />
            {gameState === 'playing' ? (
              <button 
                className={`pass-btn ${passes <= 0 ? 'disabled' : ''}`}
                onClick={handlePass}
                disabled={passes <= 0}
              >
                {passes} Passes Remaining
              </button>
            ) : ''}
            {gameState === 'gameOver' ? (
              <button className="play-again-btn" onClick={playAgain}>
                Play, Again?
              </button>
            ) : ''}
          </div>
        </>
      )}
    </div>
  );
};

// Render the game
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<WordScrambleGame />);