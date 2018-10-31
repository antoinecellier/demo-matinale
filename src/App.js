import React, { Component } from 'react';
import { Radio, Button } from 'antd';
import 'antd/dist/antd.css';
import './App.css';
import BetService from './BetService.js';
import moment from 'moment';
import ContractChecker from './ContractChecker';
import BetForm from './BetForm';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class App extends Component {
  
  
  constructor(props) {
    super(props);
    this.state = {
      match: {}, 
      selectedMatch: null, 
      amount: null, 
      matchs: [], 
      eventLogs: [], 
      currentUserPublicKey: '' };
    this.betService = new BetService();

    const methods = [
      this.onChangeMatchHomeTeam,
      this.onChangeMatchExternalTeam,
      this.onChangeMatchLabel,
      this.onChangeMatchHomeVictoryQuotation,
      this.getUpdatesFromContract,
      this.play,
      this.createMatch,
      this.addMatch,
      this.retrieveMatchs,
      this.selectMatchToBetOn
    ]
    for (let method of methods ) {
     this[method.name] = method.bind(this)
    }
  
    /* this.matchs = [{home:'France', guest: 'Russia', homeQuote: 3, guestQuote: 1.5}, {home:'Italy', guest: 'Danemark', homeQuote: 2, guestQuote: 2}];
     this.bets = [{match: 'France-Russia', date: new Date() , montant: 10}];
    */
    this.getUpdatesFromContract();
  }

  retrieveMatchs(){
    this.betService.getMatchesToBetOn().then(results => {
      this.setState({ 
        matchs: results
      })
    });
  }

  getUpdatesFromContract(){
    this.startWatchingEvents();
    setInterval(this.retrieveMatchs, 5000);
  }

  startWatchingEvents(){
    this.betService.eventSubject.subscribe(event => {
      console.log("New event", event);
      this.setState({
        ...this.state,
        eventLogs : this.state.eventLogs.concat([event])
      });
    });
    this.betService.startWatchingEvents();
  }
    
  
  selectMatchToBetOn(selectedMatch){
    this.setState({
        selectedMatch: this.state.matchs.find(match => match.libelle === selectedMatch.libelle)
    });
  }

 

  onChangeMatchHomeTeam(e) {
    this.state.match.homeTeam = e.target.value;
  }

  onChangeMatchExternalTeam(e) {
    this.state.match.externalTeam = e.target.value;
  }

  onChangeMatchLabel(e) {
    this.state.match.label = e.target.value;
  }

  onChangeMatchHomeVictoryQuotation(e){
    this.state.match.homeVictoryQuotation = e.target.value;
  }


  play() {
    this.betService.toPlay();
  }
  
  createMatch() {
    this.betService.createMatch(this.state.match.homeTeam, this.state.match.externalTeam, this.state.match.label, new Date().getTime(), this.state.match.homeVictoryQuotation);
  }

  addMatch() {
    this.createMatch();
    setTimeout(this.retrieveMatchs, 10000);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Paris sportif à travers la blockchain</h1>
          <ContractChecker/>
        </header>
        <div id="content">
          <div id="next-matches">
            <h2>Upcoming matches</h2>
            <ul>
            {this.state.matchs.map(match => 
              <li><a onClick={this.selectMatchToBetOn.bind(this,match)}><strong>{match.libelle}</strong>({match.homeTeam} - {match.externalTeam})</a></li>
            )}
            </ul>
           
          </div>
          <div className="App-intro">
            <BetForm selectedMatch={this.state.selectedMatch}/>
            <br /><br />
            <Button type="primary" onClick={this.play}>Jouer le match!</Button>
            
            <form id="creationMatch">
              <h2>Créer match</h2>
              <label htmlFor="matchLabel"> Titre match : </label> <input id="matchLabel" type="text" onChange={this.onChangeMatchLabel}/>
              <div id="match-fields">
                <label htmlFor="homeTeam"> Home team </label> 
                <label htmlFor="externalTeam"> External team </label> 
                <input id="homeTeam" type="text" onChange={this.onChangeMatchHomeTeam} /> - <input id="externalTeam" type="text" onChange={this.onChangeMatchExternalTeam}/>
                <label htmlFor="homeVictoryQuotation"> Home victory quotation </label>
                <RadioGroup id="homeVictoryQuotation" onChange={this.onChangeMatchHomeVictoryQuotation} defaultValue="3">
                  <RadioButton value="1.50">1.50</RadioButton>
                  <RadioButton value="3">3</RadioButton>
                  <RadioButton value="4.5">4.5</RadioButton>
                </RadioGroup>
               </div>
              <Button id="createMatch" type="primary" onClick={this.addMatch}>Créer le match!</Button>
            </form>
          </div>
          <div id="my-bets">
            <h2>My bets</h2>
          </div>
        </div>
        <div id="event-logs">
          <h2>Smart contract events</h2>
          {this.state.eventLogs.map(event => 
              <p>{event}</p>
          )}
          
        </div>
      </div>
    );
  }
}

export default App;
