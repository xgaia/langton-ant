import React, { Component } from "react"
import './App.css'
import antImg from './ant.png'
import { Container, Button, FormGroup, Label, CustomInput } from "reactstrap"

/**
 * Longton Ant simulation single page app 
 */

export default class App extends Component {
  constructor (props) {
    super(props)
    this.compass = [0, 1, 2, 3]
    this.cssCompass = {
      0: "N",
      1: "E",
      2: "S",
      3: "W",
    }
    this.state = {
      x_len: 15,
      y_len: 15,
      matrix: [],
      antPosition: [0, 0],
      antDirection: 0,
      timer: null,
      circular: false
    }
    this.simulate = this.simulate.bind(this)
    this.initSimulation = this.initSimulation.bind(this)
    this.stop = this.stop.bind(this)
    this.cropMax = this.cropMax.bind(this)
    this.toggleCircular = this.toggleCircular.bind(this)
  }

  initMatrix() {
    /* Init a matrix (a list of lists) with random true or false value representing the chessboard */
    return Array.apply(null, {length: this.state.x_len}).map(() => 
      {
        return Array.apply(null, {length: this.state.y_len}).map(() => {
          return Math.random() < 0.5
        })
      })
  }

  initPosition () {
    /* Get a random position on the matrix */
    const x = Math.floor(Math.random() * (this.state.x_len))
    const y = Math.floor(Math.random() * (this.state.y_len))
    return [x, y]
  }

  initDirection () {
    /* Get a random direction (0, 1, 2 or 3) representing north, south, east or west */
    return Math.floor(Math.random() * 4)
  }

  initSimulation () {
    /* Init/Reset the simulation. Stop the simulation and set matrix, position and diretion. */
    clearTimeout(this.state.timer);
    this.setState({
      matrix: this.initMatrix(),
      antPosition: this.initPosition(),
      antDirection: this.initDirection(),
    })
  }

  stop () {
    /* Stop the simulation */
    clearTimeout(this.state.timer)
  }

  simulate () {
    /* Start the simulation */
    console.log(this.state.matrix)
    console.log(this.state.antPosition)

    // Get current value (black or white) and reverse in matrix
    let currentVal
    const newMatrix = this.state.matrix.map((row, i) => {
      return row.map((col, j) => {
        // get current value
        if (i === this.state.antPosition[0] && j === this.state.antPosition[1]) {
          currentVal = col
        }
        return i === this.state.antPosition[0] && j === this.state.antPosition[1] ? !col : col
      })
    })

    // New ant direction
    const new_index = currentVal ? this.state.antDirection + 1 : this.state.antDirection - 1
    const newDir = this.circularGet(this.compass, new_index)

    // New ant position
    const newPos = this.state.circular ? this.getNewPosition(newDir, this.circularMax) : this.getNewPosition(newDir, this.cropMax)


    // set state
    this.setState({
      matrix: newMatrix,
      antPosition: newPos,
      antDirection: newDir,
      timer: setTimeout(this.simulate, 500)
    })
  }

  getNewPosition (dir, callback) {
    /* get the position when ant can pass througt walls */
    const newX = dir === 0 ? callback(this.state.antPosition[0] - 1, this.state.x_len - 1) : dir === 2 ?
                             callback(this.state.antPosition[0] + 1, this.state.x_len - 1) : 
                             this.state.antPosition[0]

    const newY = dir === 3 ? callback(this.state.antPosition[1] - 1, this.state.y_len - 1) : dir === 1 ?
                             callback(this.state.antPosition[1] + 1, this.state.y_len - 1) : 
                             this.state.antPosition[1]

    return [newX, newY]

  }

  circularGet (arr, n) {
    /* Get a value in a list, but circular if index is larger than the list */
    return arr[(n % arr.length + arr.length) % arr.length]
  }

  circularMax (val, max) {
    /* if the value is larger the the max, return 0. If val is negative, return max */
    if (val >= max) {
      return 0
    }

    if (val <= 0) {
      return max
    }

    return val
  }

  cropMax(val, max) {
    /* if the value is larger the the max, return the max. If val is negative, return 0 */
    if (val > max) {
      return this.neverNegative(max)
    } else {
      return this.neverNegative(val)
    }
  }

  neverNegative(n) {
    /* if n is negative, return 0 */
    if (n < 0) {
      return 0
    } else {
      return n
    }
  }

  componentDidMount () {
    // init matrix
    this.initSimulation()
  }


  checkPosition (i, j) {
    /* Check if i and j is the ant position */
    if (i === this.state.antPosition[0] && j === this.state.antPosition[1]) {
      return true
    }
    return false
  }

  toggleCircular () {
    this.setState({
      circular: !this.state.circular,
    })
  }

  render() {
    /* Render the matrix and the ant */
    return (
      <Container fluid className="app py-3">
      <h1 className="mb-3">Langton's Ant Simulation</h1>
      <Container>
        <p>Langton's ant is a two-dimensional universal Turing machine with a very simple set of rules but complex emergent behavior. It was invented by Chris Langton in 1986 and runs on a square lattice of black and white cells.</p>
        <p>Squares on a plane are colored variously either black or white. We arbitrarily identify one square as the "ant". The ant can travel in any of the four cardinal directions at each step it takes. The "ant" moves according to the rules below:</p>
        <ul>
          <li>At a white square, turn 90° clockwise, flip the color of the square, move forward one unit</li>
          <li>At a black square, turn 90° counter-clockwise, flip the color of the square, move forward one unit</li>
        </ul>
        <p>Use the button to start, stop and reset the simulation. The switch allows the ant to cross or not the walls of the chessboard.</p>
        <p>Sources are available on <a target="_blank" rel="noreferrer" href="http://github.com/xgaia/langton-ant">GitHub</a> under <a target="_blank" rel="noreferrer" href="https://github.com/xgaia/langton-ant/blob/main/LICENSE">AGPL-3.0</a> licence.</p>
      </Container>

      <Container className="center mb-3">
        <Button className="btn" onClick={this.simulate}>Start</Button>{" "}
        <Button className="btn" onClick={this.stop}>Stop</Button>{" "}
        <Button className="btn" onClick={this.initSimulation}>Reset</Button>
        <CustomInput value={this.state.circular} onClick={this.toggleCircular} type="switch" id="switch" name="customSwitch" label="Circular chessboard" />
      </Container>

      <div className={this.state.circular ? "circular" : "wall"}>
        {this.state.matrix.map((row, i) => (
          <div className="flex matrix-row" key={i}>
            {row.map((col, j) => (
              <span className={col ? "cell white-cell" : "cell black-cell"} key={j}>
              {this.checkPosition(i, j) ? (
                <img className={"ant " + "ant-" + this.cssCompass[this.state.antDirection]} src={antImg} alt="ant" />
              ) : null}
              </span>
            ))}
          </div>
        ))}
        </div>
      </Container>
    )
  }
}
