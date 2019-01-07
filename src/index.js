import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
function ScoreBoard(props) {
  //console.log(props);
  return (
    <div>
      <p>Player 1's Score: {props.scoreBoard.player1} </p>
      <p>Player 2's Score: {props.scoreBoard.player2} </p>
      <p>Number of ties: {props.scoreBoard.tie} </p>
    </div>
  )
}
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
       value={this.props.squares[i]}
       onClick={() => this.props.onClick(i)}
      />);
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
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      wins: {
        player1: 0,
        player2: 0,
        tie: 0,
      },
      gameOver: false,
    }
  }
  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if(this.state.gameOver || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const winner = calculateWinner(squares);
    let tie;
    if(!winner){
      tie = isTie(squares);
    }

    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      wins: {
        player1: winner === 'X' ? this.state.wins.player1+1 : this.state.wins.player1,
        player2: winner === 'O' ? this.state.wins.player2+1 : this.state.wins.player2,
        tie: tie ? this.state.wins.tie+1 : this.state.wins.tie
      },
      gameOver: winner !== null || tie,
    });
  }
  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  reset(){
    this.setState({
      history: [{
        squares: Array(9).fill(null)
      }],
      xIsNext: true,
      gameOver: false,
      stepNumber: 0
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const tie = isTie(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    let status;
    if(winner){
      status = 'Winner: ' + winner;
    }
    else if(tie){
      status = 'The game is a tie!';
    }
    else {
      status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    let button;
    if(this.state.gameOver){
      const btnStyle = {
        marginTop: '10px'
      }
      button = <button style={btnStyle} onClick={() => this.reset()}> Play Again </button>
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
          {button}
          <ScoreBoard scoreBoard={this.state.wins}/>
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
function isTie(squares){
  let count =0 ;
  for(let i =0 ;  i < squares.length; i++){
    if(squares[i])
      count++;
  }
  return count === 9;
}
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
