import React, { Component } from 'react';
import { Radio, Button } from 'antd';
import 'antd/dist/antd.css';
import './App.css';
import BetService from './BetService.js';
import moment from 'moment';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class App extends Component {
  
  
  constructor(props) {
    super(props);
    this.state = {bet: undefined, amount: null, matchs: [] };
    this.betService = new BetService();
    this.onChange = this.onChange.bind(this);
    this.onChangeAmount = this.onChangeAmount.bind(this);
    this.toBet = this.toBet.bind(this);
    this.play = this.play.bind(this);
    this.createMatch = this.createMatch.bind(this);
    /* this.matchs = [{home:'France', guest: 'Russia', homeQuote: 3, guestQuote: 1.5}, {home:'Italy', guest: 'Danemark', homeQuote: 2, guestQuote: 2}];
     this.bets = [{match: 'France-Russia', date: new Date() , montant: 10}];
    */
    this.eventsLog = [];
    this.betService.getBalance(this.betService.getCurrentEthereumAccountPubKey()).then(result => {
      console.log(result)
      this.balance = result;
    });

    this.betService.getBalance(this.betService.getBetContractPubKey()).then(result => {
      this.contractBalance = result;
    });

    this.betService.watchBets();
    this.createMatch();
    this.betService.getMatchesToBetOn().then(results => {
      this.setState({ 
        matchs: results.map(
          result => ({ homeTeam: result[1], externalTeam: result[2]}))
      })
    });
  }

  onChange(e) {
    this.state.bet = e.target.value;
  }

  onChangeAmount(e) {
    this.state.amount = e.target.value;
  }

  toBet() {
    this.betService.toBet(this.state.bet, this.state.amount);
  }

  play() {
    this.betService.toPlay();
  }
  
  createMatch() {
    this.betService.createMatch('FRANCE', 'BELGIQUE', 'demi-finale', 2);
  }

  render() {
    console.log(window.web3.eth)
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Paris sportif à travers la blockchain</h1>
          <div id="accounts-sumup">
            <div>
              <h2>My account</h2>
              <p><strong>Public key :</strong> {this.betService.getCurrentEthereumAccountPubKey()}</p>
              <p><strong>Balance :</strong> {this.balance}</p>
            </div>
            <div>
              <h2>Bet contract</h2>
              <p><strong>Public key :</strong> {this.betService.getBetContractPubKey()}</p>
              <p><strong>Balance :</strong> {this.contractBalance}</p>
            </div>
          </div>
        </header>
        <div id="content">
          <div id="next-matches">
            <h2>Upcoming matches</h2>
            <ul>
            {this.state.matchs.map(match => 
              <li><a>{match.homeTeam} - {match.externalTeam}</a></li>
            )}
            </ul>
          </div>
          <div className="App-intro">
            <h2>Bet</h2>
            <br /><br />
            <div>
              <span>Equipe A </span>
              <RadioGroup onChange={this.onChange} defaultValue="a">
                <RadioButton value="1,50">1.50</RadioButton>
                <RadioButton value="3">3</RadioButton>
                <RadioButton value="4,5">4.5</RadioButton>
              </RadioGroup>
              <span>Equipe B</span>
            </div>
            <br />
            <label>Montant du pari  </label>
            <input type="number" name="amount" length="2" onChange={this.onChangeAmount}/>
            <br /><br />
            <Button type="primary" onClick={this.toBet}>Parier</Button>
            <br /><br />
            <Button type="primary" onClick={this.play}>Jouer le match!</Button>
          </div>
          <div id="my-bets">
            <h2>My bets</h2>
          </div>
        </div>
        <div id="event-logs">
          <h2>Smart contract events</h2>
        </div>
      </div>
    );
  }
}

export default App;
