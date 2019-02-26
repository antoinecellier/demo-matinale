import React, { Component } from 'react'
import BetService from '../services/BetService'


class UpcomingMatches extends Component {
  constructor(props) {
    super(props)
    this.state = { matchs: [] }
    this.betService = new BetService()
    this.retrieveMatchs = this.retrieveMatchs.bind(this)
    this.selectedMatchUpdate = this.selectedMatchUpdate.bind(this)
  }

  componentDidMount() {
    this.setState({
      matchUpdateInterval: setInterval(this.retrieveMatchs, 5000),
    })
  }

  componentWillUnmount() {
    clearInterval(this.state.matchUpdateInterval)
  }

  selectedMatchUpdate(selectedMatch) {
    this.props.callback(selectedMatch)
    // eslint disable-next-line
    // this.setState({
    //   selectedMatch: this.state.matchs.find(match => match.libelle === selectedMatch.libelle),
    // })
  }

  retrieveMatchs() {
    this.betService.getMatchesToBetOn().then((results) => {
      this.setState({
        matchs: results,
      })
    })
  }

  render() {
    return (
      <div id="next-matches">
        <h2>Upcoming matches</h2>
        <ul>
          {this.state.matchs.map(match => (
            <li key={match.id}>
              <a onClick={() => this.selectedMatchUpdate(match)}>
                <strong>{match.libelle}</strong>
(
                {match.homeTeam}
                {' '}
-
                {' '}
                {match.externalTeam}
)
              </a>

            </li>
          ))}
        </ul>

      </div>
    )
  }
}

export default UpcomingMatches
