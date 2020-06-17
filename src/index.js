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
      currentWinner: '',
      scaleDropdown: Array(49).fill(null),
      conditionDropdown: [2,3,4,5],
      winningCondition: 2,
      boards:[],
      squares: Array(9).fill(null),
      xScore: 0,
      oScore: 0,
      xIsNext: true
    };

    this.handleChangeScale = this.handleChangeScale.bind(this);
    this.handleChangeWin = this.handleChangeWin.bind(this);
    this.renderScalable = this.renderScalable.bind(this);
    this.renderSquare = this.renderSquare.bind(this);
  }

  async componentDidMount() {
    const newScaleDropdown = this.state.scaleDropdown.slice();
    for (var a = 0; a < this.state.scaleDropdown.length; a++) {
      newScaleDropdown[a] = parseInt(a+3)
    }
    await this.setState({
      scaleDropdown: newScaleDropdown
    })
  }

  async handleClick(i) {
    const squares = this.state.squares.slice()
    const winner = await calculateWinner(i,squares, this.state.winningCondition)
    if(winner) {
      await this.setState({
        currentWinner: winner
      })
    }
    
    if (this.state.currentWinner !== ''|| squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    await this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext
    })

    const score = await calculateWinner(i,squares, this.state.winningCondition)
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

  async handleChangeScale(event) {
    const totalBox = parseInt(event.target.value) * parseInt(event.target.value)
    await this.setState({
      value: event.target.value,
      currentWinner: '',
      squares: Array(totalBox).fill(null)
    });
  }

  async handleChangeWin(event) {
    await this.setState({
      winningCondition: event.target.value,
      currentWinner: ''
    });
  }

  handleScore(winner) {
    (winner === 'X' ? 
      this.setState({
        xScore: this.state.xScore + parseInt(1),
        currentWinner: 'X'
      }) 
    : 
      this.setState({
        oScore: this.state.oScore + parseInt(1),
        currentWinner: 'O'
      })
    )
  }

  newGame() {
    this.setState({
      value: 3,
      boards:[],
      squares: Array(9).fill(null),
      xIsNext: true,
      currentWinner: '',
      winningCondition: 2
    })
  }

  handleScale() {
    return (
      <div className="form-group">
        {/* <label htmlFor="sel1">Select Scale:</label> */}
        <form>
          <div className="row">
            <div className="col">
              <label htmlFor="sel1">Select Scale:</label>
            </div>
            <div className="col">
              <label htmlFor="sel2">Winning Condition:</label>
            </div>
            <div className="col">
              <label htmlFor="sel3"></label>
            </div>
            <div className="col">
              <label htmlFor="sel3"></label>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <select 
                value={this.state.value} 
                onChange={this.handleChangeScale}
                className="form-control" 
                id="sel1">
                  {this.state.scaleDropdown.map(scales => (
                    <option value={scales}>{scales} </option>
                  ))}
              </select>
            </div>
            <div className="col">
              <select 
                value={this.state.winningCondition} 
                onChange={this.handleChangeWin}
                className="form-control" 
                id="sel1">
                  {this.state.conditionDropdown.map(win => (
                    <option value={win}>{win} </option>
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
    let status;

    if (this.state.currentWinner !== '') {
      status = 'Winner: ' + this.state.currentWinner;
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
        
        <br/><br/>
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

function calculateWinner(index, squares, winCount) {
  const rows = Math.sqrt(squares.length)
  var win = 0
  var winner = ''
  const mod = parseInt(index % rows)
  var colNum = mod

  //column dynamic
  for (let col = 0; col < rows-1; col++) {
    if (squares[colNum] === squares[parseInt(colNum+rows)] && squares[colNum] && squares[parseInt(colNum+rows)]) {
      win = win + 1
      winner = squares[colNum]
    }
    parseInt(colNum+=rows)
  }
  if (win === rows-1 || win >= parseInt(winCount-1) ) {
    return winner
  } else {
    win = 0
  }

  //rows dynamic
  //loop no 1 is to check row index
  var low = 0
  var high = parseInt(0+rows-1)
  for ( let row = 0; row < rows; row++ ) {
    if (index >= low && index <= high) {
      break;
    }
    parseInt(low+= rows)
    parseInt(high +=rows)
  }
  // loop no 2 is to check on certain row index
  for (let rowCheck = low ; rowCheck < high; rowCheck++) {
    if (squares[rowCheck] === squares[parseInt(rowCheck+1)] && squares[rowCheck] && squares[parseInt(rowCheck+1)]) {
      win = win + 1
      winner = squares[rowCheck]
    }
  }
  if (win === rows-1 || win >= parseInt(winCount-1)) {
    return winner
  } else {
    win = 0
  }



  // // check rows
  // for (let i = 0; i < rows -1; i++) {
  //   for (let j = 0; j < rows -1 ; j++) {
  //     if (squares[parseInt((j*rows)+i)] === squares[parseInt(((j+1)*rows)+i)]) {
  //       win = win + 1
  //       winner = squares[parseInt(j*rows)+i]
  //     }
  //   }

  //   if (win === rows-1 ) {
  //     return winner
  //   } else {
  //     win = 0
  //   }
  // }
  

  // // check columns
  // for (let k = 0; k < rows -1; k++) {
  //   for (let l = 0; l < rows -1 ; l++) {
  //     if (squares[parseInt(l+(rows*k))] === squares[parseInt(l+1+(rows*k))]) {
  //       win = win + 1
  //       winner = squares[parseInt(l+(rows*k))]
  //     }
  //   }

  //   if (win === rows-1 ) {
  //     return winner
  //   } else {
  //     win = 0
  //   }
  // }
  
  //check left diagonal
  for (var m = 0; m < rows - 1; m++) {
    if (squares[parseInt(m+(rows*m))] === squares[parseInt((rows*(m+1))+(m+1))] && squares[parseInt(m+(rows*m))] && squares[parseInt((rows*(m+1))+(m+1))]) {
      win = win + 1
      winner = squares[parseInt(m+(rows*m))]
    }
  }
  if (win === rows-1 || win >= parseInt(winCount-1)) {
    return winner
  } else {
    win = 0
  }

  //check right diagonal
  for (var n = rows-1; n < squares.length - 1; n += rows -1) {
    if (squares[parseInt(n)] === squares[parseInt(n+rows-1)] && squares[parseInt(n)] && squares[parseInt(n+rows-1)]) {
      win = win + 1
      winner = squares[parseInt(n)]
    }
  }
  if (win === rows-1 || win >= parseInt(winCount-1)) {
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
