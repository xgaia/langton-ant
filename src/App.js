import React, { Component } from "react"
import './App.css'
import antImg from './ant.png';


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
      ant_position: [0, 0],
      ant_direction: 0,
      timer: null,
    }
    this.simulate = this.simulate.bind(this)
    this.initSimulation = this.initSimulation.bind(this)
    this.stop = this.stop.bind(this)
  }

  initMatrix() {
    return Array.apply(null, {length: this.state.x_len}).map(() => 
      {
        return Array.apply(null, {length: this.state.y_len}).map(() => {
          return Math.random() < 0.5
        })
      })
  }

  initSimulation () {
    clearTimeout(this.state.timer);
    this.setState({
      matrix: this.initMatrix(),
      ant_position: [Math.floor(Math.random() * (this.state.x_len)), Math.floor(Math.random() * (this.state.y_len))],
      ant_direction: Math.floor(Math.random() * 4),
    })
  }

  stop () {
    clearTimeout(this.state.timer)
  }

  simulate () {
    // Get current value (black or white) and reverse in matrix
    let currentVal
    const newMatrix = this.state.matrix.map((row, i) => {
      return row.map((col, j) => {
        // get current value
        if (i === this.state.ant_position[0] && j === this.state.ant_position[1]) {
          currentVal = col
        }
        return i === this.state.ant_position[0] && j === this.state.ant_position[1] ? !col : col
      })
    })

    // New ant direction
    const new_index = currentVal ? this.state.ant_direction + 1 : this.state.ant_direction - 1
    const new_dir = this.circular(this.compass, new_index)

    // New position
    const new_x = new_dir === 0 ? this.getIndexMaxi(this.state.x_len, this.state.ant_position[0], -1) : new_dir === 2 ? this.getIndexMaxi(this.state.x_len, this.state.ant_position[0], 1) : this.state.ant_position[0]
    const new_y = new_dir === 3 ? this.getIndexMaxi(this.state.x_len, this.state.ant_position[1], -1) : new_dir === 1 ? this.getIndexMaxi(this.state.x_len, this.state.ant_position[1], 1) : this.state.ant_position[1]

    const new_pos = [new_x, new_y]

    // set state
    this.setState({
      matrix: newMatrix,
      ant_position: new_pos,
      ant_direction: new_dir,
      timer: setTimeout(this.simulate, 500)
    })
  }

  circular (arr, n) {
    return arr[(n % arr.length + arr.length) % arr.length]
  }

  getIndexMaxi (max, pos, val) {
    if (pos + val >= max) {
      return max
    } else {
      return this.neverNegative(pos + val)
    }
  }

  neverNegative(n) {
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
    if (i === this.state.ant_position[0] && j === this.state.ant_position[1]) {
      return true
    }
    return false
  }


  render() {

    return (
      <div className="app">
      <div>
        <button className="btn" onClick={this.simulate}>Start</button>{" "}
        <button className="btn" onClick={this.stop}>Stop</button>{" "}
        <button className="btn" onClick={this.initSimulation}>Reset</button>
      </div>
        {this.state.matrix.map((row, i) => (
          <div className="flex matrix-row" key={i}>
            {row.map((col, j) => (
              <span className={col ? "cell white-cell" : "cell black-cell"} key={j}>
              {this.checkPosition(i, j) ? (
                <img className={"ant " + "ant-" + this.cssCompass[this.state.ant_direction]} src={antImg} alt="ant" />
              ) : null}
              </span>
            ))}
          </div>
        ))}
      </div>
    )
  }
}
