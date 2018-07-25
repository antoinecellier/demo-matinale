import Web3 from 'web3';

import betContract from './truffle-build/contracts/Bet.json';

class BetService {  
  constructor() {
    this.state = {bet: undefined, amount: null, matches : [], eventLogs: [] };
    this.toBet = this.toBet.bind(this);
    this.play = this.play.bind(this);
    this.getBalance = this.getBalance.bind(this);
    this.createMatch = this.createMatch.bind(this);
    this.getMatchesToBetOn = this.getMatchesToBetOn.bind(this);

    this.getCurrentEthereumAccountPubKey = this.getCurrentEthereumAccountPubKey.bind(this);

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
   this.state.ContractInstance = MyContract.at(this.getBetContractPubKey())
  }

  getBetContractPubKey() {
    return "0x00d34A6611cC7ffF292734880C020cb88a341b1B";
  }

  watchBets() {
    this.state.ResolvedBet = this.state.ContractInstance.ResolvedBet()
    this.state.ResolvedBet.watch((error, result) => {
      console.log(error, result)
    })
  }
 
  toBet(winningTeam, amountToBet) {
    this.state.ContractInstance.bet(
      winningTeam, true, false, false, "Equipe A", {
      gas: 300000,
      from: this.getCurrentEthereumAccountPubKey(),
      value: window.web3.toWei(amountToBet, 'ether')
   }, (err, result) => {
      console.log(err, result)
   })
  }

  play() {
    this.state.ContractInstance.resolveBet({
      gas: 300000,
      from: this.getCurrentEthereumAccountPubKey()
   }, (err, result) => {
      console.log(err, result)
   })
  }
  
  getBalance(account){
    return new Promise((resolve, reject) => {
      this.web3.eth.getBalance(account, (error, result) => {
          if(error){
              reject(error);
          }
          else{
              resolve(this.web3.fromWei(result.toNumber(), 'ether'));
          }
      })
    }); 
  } 

  getCurrentEthereumAccountPubKey() {
    return this.web3.eth.accounts[0];
  }

  createMatch(homeTeam, challengerTeam, libelle, date) {
    this.state.ContractInstance.createMatch(homeTeam, challengerTeam, libelle, date,{
      gas: 1000000,
      from: this.getCurrentEthereumAccountPubKey()
   }, (err, result) => {
      console.log(err, result)
   })
  }


  getMatchesToBetOn(){
    return new Promise((resolve, reject)=> {
      let matches = [];
      let contractInst = this.state.ContractInstance;
      console.log(contractInst)
      this.state.ContractInstance.getMatchsLenght.call(function(err, lenght){
        if(err){
          reject("Erreur récupération lenght",err);
        }
        const matchsLenght = lenght;
        let matchCounter = 0;
        for(let i = 0; i < matchsLenght ; i++ ){
          contractInst.matchs.call(i,function(err, match){
            if(err){
              reject("Erreur récupération match",err);
            }
            matches.push(match);
            console.log("Counter " + (matchCounter+1) + "Match counter " + matchsLenght);
            if(++matchCounter == matchsLenght){
              resolve(matches);
            }
          }); 
        }
      });
    }); 
  }

  printEvent(event){
    return event.event + ` : ` +  JSON.stringify(event.args);
  }

  startWatchingEvents() {
    this.state.events = this.state.ContractInstance.allEvents({fromBlock: 0, toBlock: 'latest'});
     // would get all past logs again.
    this.state.events.get((error, logs) => { 
      if (error) {
        console.log('Error in myEvent event handler: ' + error);
      } else {
        logs.forEach(log => {
          this.state.eventLogs.push(this.printEvent(log));
        });
      }
    });

    this.state.events.watch((error, result) => {
      this.state.eventLogs.push(this.printEvent(result));
    });
  }

  stopWatchingEvents(){
    // would stop and uninstall the filter
    this.state.events.stopWatching();
  }

}




export default BetService;
