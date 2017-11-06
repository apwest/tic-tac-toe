import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Use a functional component, since Square only needs to render itself
// and doesn't have to do anything else.
function Square(props) {
  return (
    <button className="square" onClick={props.onClick} style={{backgroundColor: props.highlight?"yellow":"inherit"}} >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const highlight = this.props.winner ? this.props.winner.squares.includes(i) : false;
    return (
      <Square 
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)} 
        highlight={highlight}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        slot: null,
      }],
      xIsNext: true,
      moveNumber: 0,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.moveNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    // Check if square is already filled or if there's a winner
    if (squares[i] || checkForWinner(squares)) {
      return;
    }

    // Change the copy as necessary and update the state
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        slot: i,
      }]),
      xIsNext: !this.state.xIsNext,
      moveNumber: history.length,
    });
  }

  jumpTo(moveIdx) {
    this.setState({
      xIsNext: !(moveIdx % 2),
      moveNumber: moveIdx,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.moveNumber];
    const winner = checkForWinner(current.squares);

    const moves = history.map((move, idx) => {
      const desc = (
        idx 
        ? 
        "Goto move " + idx + " (" + (Math.trunc(move.slot/3) + 1) + "," + ((move.slot%3) + 1) + ")" 
        : 
        "Goto start of game"
      );

      return (
        <li key={idx} style={{fontWeight: this.state.moveNumber === idx ? "bold" : "normal"}}>
          <button onClick={() => this.jumpTo(idx)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner.player;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares} 
            onClick={(i) => this.handleClick(i)} 
            winner={winner}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function checkForWinner(squares) {
  // Winning lines
  const lines = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6],
  ];

  // Check if any of the winning lines are filled with X's or O's
  // and return 'X' or 'O' if true.
  for (let i = 0; i < lines.length; i++) {
    const [a,b,c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {player: squares[a], squares: lines[i]};
    }
  }

  // No winner
  return null;
}