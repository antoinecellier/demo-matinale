import React, { Component } from 'react';
import 'antd/dist/antd.css';
import './App.css';
import ContractChecker from './ContractChecker';
import BetForm from './BetForm';
import UpcomingMatches from './UpcomingMatches';
import EventWatcher from './EventWatcher';
import MatchCreationForm from './MatchCreationForm';
import Bets from './Bets';


class App extends Component {
  
  
  constructor(props) {
    super(props);
    this.state = {
      selectedMatch: null
    };
  }

  
  selectedMatchUpdate(selectedMatch){
    this.setState({
        selectedMatch: selectedMatch
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Paris sportif à travers la blockchain</h1>
          <ContractChecker/>
        </header>
        <div id="content">
          <UpcomingMatches callback={this.selectedMatchUpdate.bind(this)}/>
          <div className="App-intro">
            <BetForm selectedMatch={this.state.selectedMatch}/>
            <br /><br />
            <MatchCreationForm/>
          </div>
          <Bets></Bets>
        </div>
        <EventWatcher/>
      </div>
    );
  }
}

export default App;
