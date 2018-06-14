import React, { Component } from 'react';
import logo from './logo.svg';
import { Radio, Button } from 'antd';
import Web3 from 'web3';
import 'antd/dist/antd.css';
import './App.css';
import betContract from './truffle-build/contracts/Bet.json';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class App extends Component {
  

  constructor(props) {
    super(props);
    this.state = {bet: undefined, amount: null };
    this.onChange = this.onChange.bind(this);
    this.onChangeAmount = this.onChangeAmount.bind(this);
    this.toBet = this.toBet.bind(this);
    this.play = this.play.bind(this);

    if(typeof window.web3 != 'undefined'){
      console.log("Using web3 detected from external source like Metamask")
      this.web3 = new Web3(window.web3.currentProvider) // eslint-disable-line no-undef
   }else{
      console.log("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
      this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545")) // eslint-disable-line no-undef
   }
   const betAbi = betContract.abi;
   // TODO : ne fonctionne que si on fait un lien symbolique truffle-build dans src vers le répertoire de build de truffle
   // ln -s ../build truffle-build
   const MyContract = window.web3.eth.contract(betAbi);


   this.state.ContractInstance = MyContract.at("0x00d34A6611cC7ffF292734880C020cb88a341b1B")
   this.state.ResolvedBet = this.state.ContractInstance.ResolvedBet()
   this.state.ResolvedBet.watch((error, result) => {
     console.log(error, result)
   })
  }

  onChange(e) {
    this.state.bet = e.target.value;
  }

  onChangeAmount(e) {
    this.state.amount = e.target.value;
  }

  toBet() {
    this.state.ContractInstance.bet(
      this.state.bet, true, false, false, "Equipe A", {
      gas: 300000,
      from: window.web3.eth.accounts[0],
      value: window.web3.toWei(this.state.amount, 'ether')
   }, (err, result) => {
      console.log(err, result)
   })
  }

  play() {
    this.state.ContractInstance.resolveBet({
      gas: 300000,
      from: window.web3.eth.accounts[0]
   }, (err, result) => {
      console.log(err, result)
   })
  }

  render() {
    console.log(window.web3.eth)
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Paris sportif à travers la blockchain</h1>
        </header>
        <div className="App-intro">
          <br /><br />
          <div>
          Equipe A 
          <RadioGroup onChange={this.onChange} defaultValue="a">
            <RadioButton value="1,50">1.50</RadioButton>
            <RadioButton value="3">3</RadioButton>
            <RadioButton value="4,5">4.5</RadioButton>
          </RadioGroup>
           Equipe B
          </div>
          <br />
          <label>Montant du pari  </label>
          <input type="number" name="amount" length="2" onChange={this.onChangeAmount}/>
          <br /><br />
          <Button type="primary" onClick={this.toBet}>Parier</Button>
          <br /><br />
          <Button type="primary" onClick={this.play}>Jouer le match!</Button>
        </div>
      </div>
    );
  }
}

export default App;
