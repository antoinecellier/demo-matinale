import React, { Component } from 'react'
import { Radio, Button } from 'antd'
import BetService from '../services/BetService'

const RadioButton = Radio.Button
const RadioGroup = Radio.Group


class EndMatchform extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasHomeWon: false,
      wasThereEquality: true,
    }
    this.betService = new BetService()
    const methods = [
      this.onChangeMatchResult,
      this.endMatch,
    ]
    methods.forEach((method) => {
      this[method.name] = method.bind(this)
    })
  }


  onChangeMatchResult(event) {
    this.setState({
      hasHomeWon: event.target.value === '1',
      wasThereEquality: event.target.value === '0',
    })
  }

  endMatch() {
    const { hasHomeWon, wasThereEquality } = this.state
    const { selectedMatch } = this.props
    this.betService.resolveMatch(selectedMatch.id, hasHomeWon, wasThereEquality)
  }


  render() {
    const { selectedMatch } = this.props
    return (
      <form>
        <h2>
        Enter match
          {' '}
          {selectedMatch.libelle}
          {' '}
        result
        </h2>
        <div>
          <RadioGroup id="matchResultRadio" onChange={this.onChangeMatchResult} defaultValue="0">
            <RadioButton value="1">
              {selectedMatch.homeTeam}
              {' '}
            has won
            </RadioButton>
            <RadioButton value="0">Equality</RadioButton>
            <RadioButton value="-1">
              {selectedMatch.externalTeam}
              {' '}
            has won
            </RadioButton>
          </RadioGroup>
        </div>
        <br />
        <Button type="primary" onClick={this.endMatch}>End match</Button>
      </form>
    )
  }
}

export default EndMatchform
