import Web3 from 'web3';

import betContract from './truffle-build/contracts/Betting.json';

import { Subject } from 'rxjs';

class BetService {
  constructor() {
    this.state = { bet: undefined, amount: null, matches: [], eventLogs: [] };
    const methods = [
      this.bet,
      this.resolveMatch,
      this.getBalance,
      this.createMatch,
      this.getMatchesToBetOn,
      this.getCurrentEthereumAccountPubKey,
      this.startWatchingEvents,
      this.stopWatchingEvents,
    ]
    for (let method of methods) {
      this[method.name] = method.bind(this)
    }

    this.eventSubject = new Subject();

    if (typeof window.web3 != 'undefined') {
      console.log("Using web3 detected from external source like Metamask")
      this.web3 = new Web3(window.web3.currentProvider) // eslint-disable-line no-undef
    } else {
      console.log("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
      this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545")) // eslint-disable-line no-undef
    }
    const betAbi = betContract.abi;
    // TODO : ne fonctionne que si on fait un lien symbolique truffle-build dans src vers le répertoire de build de truffle
    // ln -s ../build truffle-build
    this.state.MyContract = window.web3.eth.contract(betAbi);
    this.state.ContractInstance = this.state.MyContract.at(this.getBetContractPubKey())
  }

  getBetContractPubKey() {
    return "0xc4F13832B90c1C02e1eb82c67D7f494e224d839F";
  }

  bet(matchId, betOnHomeTeamWin, betOnHomeTeamEquality, amountToBet) {
    this.state.ContractInstance.betOnMatch(
      betOnHomeTeamWin, betOnHomeTeamEquality, matchId, {
        gas: 300000,
        from: this.getCurrentEthereumAccountPubKey(),
        value: window.web3.toWei(amountToBet, 'ether')
      }, (err, result) => {
        console.log(err, result)
      })
  }

  resolveMatch(matchId, hasHomeTeamWon, wasThereEquality) {
    this.state.ContractInstance.resolveMatch(
      matchId, hasHomeTeamWon, wasThereEquality,{
      gas: 3000000,
      from: this.getCurrentEthereumAccountPubKey()
    }, (err, result) => {
      console.log(err, result)
    })
  }

  getBalance(account) {
    return new Promise((resolve, reject) => {
      this.web3.eth.getBalance(account, (error, result) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(this.web3.fromWei(result.toNumber(), 'ether'));
        }
      })
    });
  }

  getCurrentEthereumAccountPubKey() {
    return this.web3.eth.accounts[0];
  }

  createMatch(homeTeam, challengerTeam, libelle, date, quotation) {
    this.state.ContractInstance.createMatch(homeTeam, challengerTeam, libelle, date, Math.floor(quotation * 100), {
      gas: 1000000,
      from: this.getCurrentEthereumAccountPubKey()
    }, (err, result) => {
      console.log(err, result)
    })
  }


  getMatchesToBetOn() {
    return new Promise((resolve, reject) => {
      let matches = [];
      let contractInst = this.state.ContractInstance;
      this.state.ContractInstance.getMatchsLenght.call(function (err, matchsLenght) {
        if (err) {
          reject("Erreur récupération lenght", err);
        }
        let matchCounter = 0;
        for (let i = 0; i < matchsLenght; i++) {
          contractInst.matchs.call(i, (err, match) => {
            if (err) {
              reject("Erreur récupération match", err);
            }

            matches.push({ 
              id: match[0].toNumber(), 
              homeTeam: match[1], 
              externalTeam: match[2], 
              settledOnHomeVictory: match[3], 
              settledOnEquality: match[4], 
              libelle: match[5],
              date: match[6].toNumber(),
              settled: match[7],
              quotation: match[8].toNumber()
             });
            if (++matchCounter == matchsLenght) {
              resolve(matches);
            }
          });
        }
      });
    });
  }

  printEvent(event) {
    console.log("salut", event);
    return event.event + ` : ` + JSON.stringify(event.args);
  }

  startWatchingEvents() {
    this.state.eventsFilter = this.state.ContractInstance.allEvents({ fromBlock: 0, toBlock: 'latest' });
    this.state.eventsFilter.watch((error, result) => {
      this.eventSubject.next(this.printEvent(result));
    });
    console.log(this.state.ContractInstance);
    this.state.betTreatmentFilter = this.state.ContractInstance.ResolvedBet({}, { fromBlock: 0, toBlock: 'latest' }, function(error, result){
      if (!error) {
       this.eventSubject.next(this.printEvent(result));
      }else {
       console.log(error);
      }
     });
  }

  stopWatchingEvents() {
    // will stop and uninstall the filter
    this.state.eventsFilter.stopWatching();
    this.state.betTreatmentFilter.stopWatching();
  }

}




export default BetService;
