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

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 3,
      scaleOption: [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
      boards:[],
      squares: Array(9).fill(null),
      xScore: 0,
      oScore: 0,
      xIsNext: true
    };
    this.handleChange = this.handleChange.bind(this);
    this.renderScalable = this.renderScalable.bind(this);
    this.renderSquare = this.renderSquare.bind(this);
    // this.handleScore = this.handleScore.bind(this);
  }

  async handleClick(i) {
    const squares = this.state.squares.slice()
    // console.log(i)
    if (await calculateWinner(i,squares) || squares[i]) {
      console.log(i,squares[i])
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    await this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext
    })

    const score = await calculateWinner(i,squares)
    if (score !== null) {
      this.handleScore(score)
    }
    // console.log('index = ' + i + '; value = ' + squares[i])
    // console.log(squares[i])
    // this.state.xIsNext ? this.setState({xIsNext: false}) : this.setState({xIsNext: true})
  }
  
  renderSquare(i) {
    return (
      <Square 
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  renderSideBox(index) {
    const sideBox = []
    var total = 0
    if (index === 0) {
      for (var j = 0; j < this.state.value; j++) {
        sideBox.push(
          this.renderSquare(j)
        )
      }
    } else {
      total = parseInt(this.state.value) + parseInt(index)
      for (var k = index; k < total; k++) {
        sideBox.push(
          this.renderSquare(k)
        )
      }
    }
    return sideBox
  }

  renderScalable() {
    const result = []
    for (var i = 0; i < this.state.value; i++) {
      result.push(
        <div className="board-row">
          {this.renderSideBox((i === 0 ? 0 : this.state.value * i))}
        </div>
      )
    }
    return result
  }

  async handleChange(event) {
    const totalBox = parseInt(event.target.value) * parseInt(event.target.value)
    await this.setState({
      value: event.target.value,
      squares: Array(totalBox).fill(null)
    });
  }

  handleScore(winner) {
    (winner === 'X' ? 
      this.setState({
        xScore: this.state.xScore + parseInt(1)
      }) 
    : 
      this.setState({
        oScore: this.state.oScore + parseInt(1)
      })
    )
  }

  newGame() {
    this.setState({
      value: 3,
      // scaleOption: [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
      boards:[],
      squares: Array(9).fill(null),
      xIsNext: true
    })
  }

  handleScale() {
    return (
      <div className="form-group">
        <label htmlFor="sel1">Select Scale:</label>
        <form>
          <div className="row">
            <div className="col">
            <select 
              value={this.state.value} 
              onChange={this.handleChange}
              className="form-control" 
              id="sel1">
                {this.state.scaleOption.map(scales => (
                  <option key={scales} value={scales}>{scales} </option>
                ))}
              </select>
            </div>
            <div className="col">
              <button type="button" className="btn btn-primary" onClick={() => this.newGame()}>New Game</button>
            </div>
            <div className="col">
              <button type="button" className="btn btn-warning" onClick={() => window.location.reload(false)}>Restart Score</button>
            </div>
          </div>
        </form>
        
      </div>
    )
  }

  render() {
    const winner = calculateWinner('', this.state.squares);
    // this.handleScore(winner)
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const oScore = 'O Win : ' + this.state.oScore
    const xScore = 'X Win : ' + this.state.xScore 

    return (
      <div>
        <div className="dropdown-scale">
          {this.handleScale()}
        </div>
        
        <div className="score">
          {oScore}
          <br/>
          {xScore}
        </div>
        
        <br/><br/><br/>
        <div className="status">{status}</div>
        <div>
          {this.renderScalable()}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
      </div>
    );
  }
}

function calculateWinner(index, squares) {
  // console.log(squares)

  // console.log(Math.sqrt(squares.length))
  const rows = Math.sqrt(squares.length)
  var win = 0
  var winner = ''

  //check rows
  for (let i = 0; i < rows -1; i++) {
    for (let j = 0; j < rows -1 ; j++) {
      if (squares[parseInt((j*rows)+i)] === squares[parseInt(((j+1)*rows)+i)]) {
        win = win + 1
        winner = squares[parseInt(j*rows)+i]
      }
    }

    if (win === rows-1 ) {
      return winner
    } else {
      win = 0
    }
  }
  

  //check columns
  for (let k = 0; k < rows -1; k++) {
    for (let l = 0; l < rows -1 ; l++) {
      if (squares[parseInt(l+(rows*k))] === squares[parseInt(l+1+(rows*k))]) {
        win = win + 1
        winner = squares[parseInt(l+(rows*k))]
      }
    }

    if (win === rows-1 ) {
      return winner
    } else {
      win = 0
    }
  }
  
  //check left diagonal
  for (var m = 0; m < rows - 1; m++) {
    if (squares[parseInt(m+(rows*m))] === squares[parseInt((rows*(m+1))+(m+1))]) {
      win = win + 1
      winner = squares[parseInt(m+(rows*m))]
    }
  }
  if (win === rows-1) {
    return winner
  } else {
    win = 0
  }

  //check right diagonal
  for (var n = rows-1; n < squares.length - 1; n += rows -1) {
    if (squares[parseInt(n)] === squares[parseInt(n+rows-1)]) {
      win = win + 1
      winner = squares[parseInt(n)]
    }
  }
  if (win === rows-1) {
    return winner
  } else {
    win = 0
  }



  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
