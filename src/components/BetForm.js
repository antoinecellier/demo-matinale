import React, { Component } from 'react'
import { Radio, Button } from 'antd'
import BetService from '../services/BetService'
import EndMatchForm from './EndMatchForm'

const RadioButton = Radio.Button
const RadioGroup = Radio.Group

class BetForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bet: {},
      // matchResult: {
      //   willBeAnHomeTeamWin: false,
      //   willBeADraw: true,
      // },
    }
    this.betService = new BetService()
    const methods = [
      this.onChangeBetAmount,
      this.onChangeBetWinningTeam,
      this.bet,
    ]
    methods.forEach((method) => {
      this[method.name] = method.bind(this)
    })
  }

  onChangeBetWinningTeam(e) {
    const { bet } = this.state
    this.setState({
      bet: {
        ...bet,
        willBeAnHomeTeamWin: e.target.value === '1',
        willBeADraw: e.target.value === '0',
      },
    })
  }

  onChangeBetAmount(e) {
    const { bet } = this.state
    this.setState({
      bet: {
        ...bet,
        amount: e.target.value,
      },
    })
  }

  bet() {
    const { bet: { willBeAnHomeTeamWin, willBeADraw, amount } } = this.state
    const { selectedMatch } = this.props
    this.betService.bet(selectedMatch.id, willBeAnHomeTeamWin, willBeADraw, amount)
  }


  render() {
    const { selectedMatch } = this.props

    return (
      <div>
        {
        selectedMatch ? (
          <div>
            <h2>
              Bet on match
              {' '}
              {selectedMatch.libelle}
            </h2>
            <form>
              <div>
                <RadioGroup id="betWinningTeamRadio" onChange={this.onChangeBetWinningTeam} defaultValue="0">
                  <RadioButton value="1">
                    {selectedMatch.homeTeam}
                    {' '}
                      win
                  </RadioButton>
                  <RadioButton value="0">Equality</RadioButton>
                  <RadioButton value="-1">
                    {selectedMatch.externalTeam}
                    {' '}
                    win
                  </RadioButton>
                </RadioGroup>
              </div>
              <br />
              <label>Montant du pari  </label>
              <input
                type="number"
                name="betAmount"
                id="betAmount"
                length="2"
                onChange={this.onChangeBetAmount}
              />
              <br />
              {' '}
              <br />
              <Button type="primary" onClick={this.bet}>Parier</Button>
            </form>

            <br />
            {' '}
            <br />
            <EndMatchForm selectedMatch={selectedMatch} />
          </div>
        )
          : (<p>Please select a match to bet on.</p>)
    }
      </div>
    )
  }
}

export default BetForm
