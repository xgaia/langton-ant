import React, { Component } from "react"
import './App.css'
import antImg from './ant.png'
import { Container, Button } from "reactstrap"

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
    }
    this.simulate = this.simulate.bind(this)
    this.initSimulation = this.initSimulation.bind(this)
    this.stop = this.stop.bind(this)
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
    const newX = newDir === 0 ? this.cropMax(this.state.antPosition[0] - 1, this.state.x_len - 1) : 
                                  newDir === 2 ? this.cropMax(this.state.antPosition[0] + 1, this.state.x_len - 1) : 
                                  this.state.antPosition[0]

    const newY = newDir === 3 ? this.cropMax(this.state.antPosition[1] - 1, this.state.y_len - 1) :
                                  newDir === 1 ? this.cropMax(this.state.antPosition[1] + 1, this.state.y_len - 1) : 
                                  this.state.antPosition[1]

    const new_pos = [newX, newY]

    // set state
    this.setState({
      matrix: newMatrix,
      antPosition: new_pos,
      antDirection: newDir,
      timer: setTimeout(this.simulate, 500)
    })
  }

  circularGet (arr, n) {
    /* Get a value in a list, but circular if index is larger than the list */
    return arr[(n % arr.length + arr.length) % arr.length]
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


  render() {
    /* Render the matrix and the ant */
    return (
      <Container fluid className="app">
      <Container>
        <Button className="btn" onClick={this.simulate}>Start</Button>{" "}
        <Button className="btn" onClick={this.stop}>Stop</Button>{" "}
        <Button className="btn" onClick={this.initSimulation}>Reset</Button>
      </Container>
      <div>
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
