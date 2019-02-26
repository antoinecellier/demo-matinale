import React, { Component } from 'react'
import 'antd/dist/antd.css'
import './App.css'
import ContractChecker from './components/ContractChecker'
import BetForm from './components/BetForm'
import UpcomingMatches from './components/UpcomingMatches'
import EventWatcher from './components/EventWatcher'
import MatchCreationForm from './components/MatchCreationForm'
import Bets from './components/Bets'


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedMatch: null,
    }
    this.selectedMatchUpdate = this.selectedMatchUpdate.bind(this)
  }


  selectedMatchUpdate(selectedMatch) {
    this.setState({
      selectedMatch,
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Paris sportif à travers la blockchain</h1>
          <ContractChecker />
        </header>
        <div id="content">
          <UpcomingMatches callback={this.selectedMatchUpdate} />
          <div className="App-intro">
            <BetForm selectedMatch={this.state.selectedMatch} />
            <br />
            <br />
            <MatchCreationForm />
          </div>
          <Bets />
        </div>
        <EventWatcher />
      </div>
    )
  }
}

export default App
