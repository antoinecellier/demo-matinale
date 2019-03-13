import React, { Component } from 'react'
import BetService from '../services/BetService'


class Bets extends Component {
  constructor(props) {
    super(props)
    this.state = { bets: [] }
    this.betService = new BetService()
    this.retrieveBets = this.retrieveBets.bind(this)
  }

  componentDidMount() {
    this.setState({
      betUpdateInterval: setInterval(this.retrieveBets, 5000),
    })
  }

  componentWillUnmount() {
    clearInterval(this.state.betUpdateInterval)
  }

  retrieveBets() {
    this.betService.getBets().then((bets) => {
      this.setState({
        bets,
      })
    })
  }

  render() {
    const renderPrediction = ({ homeVictoryBet, equalityBet }) => {
      if (homeVictoryBet) return 'Home victory'
      if (equalityBet) return 'Equality'
      return 'Challenger victory'
    }

    return (
      <div id="my-bets">
        <h2>My Bets</h2>
        <ul>
          {this.state.bets.map(bet => (
            <li key={bet.match_id}>
              {`${bet.amount} ether ${renderPrediction(bet)} (${bet.homeTeam} - ${bet.externalTeam})`}
            </li>
          ))}
        </ul>

      </div>
    )
  }
}

export default Bets
