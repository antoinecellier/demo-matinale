import React, { Component } from 'react'
import BetService from '../services/BetService'

class ContractChecker extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.getCurrentUserBalance = this.getCurrentUserBalance.bind(this)
    this.getContractAccountBalance = this.getContractAccountBalance.bind(this)
    this.getCurrentUserPublicKey = this.getCurrentUserPublicKey.bind(this)
    this.betService = new BetService()
  }

  componentDidMount() {
    this.setState({
      contractAccountInterval: setInterval(this.getContractAccountBalance, 5000),
      currentUserBalanceInterval: setInterval(this.getCurrentUserBalance, 5000),
      currentUserPublicKeyInterval: setInterval(this.getCurrentUserPublicKey, 5000),
    })
  }

  componentWillUnmount() {
    const {
      contractAccountInterval,
      currentUserBalanceInterval,
      currentUserPublicKeyInterval,
    } = this.state

    clearInterval(contractAccountInterval)
    clearInterval(currentUserBalanceInterval)
    clearInterval(currentUserPublicKeyInterval)
  }


  getCurrentUserPublicKey() {
    this.setState({
      currentUserPublicKey: this.betService.getCurrentEthereumAccountPubKey(),
    })
  }

  getCurrentUserBalance() {
    this.betService.getBalance(this.betService.getCurrentEthereumAccountPubKey()).then((result) => {
      this.setState({
        currentUserBalance: result,
      })
    })
  }

  getContractAccountBalance() {
    this.betService.getBalance(BetService.getBetContractPubKey()).then((result) => {
      this.setState({
        contractBalance: result,
      })
    })
  }

  render() {
    const { currentUserPublicKey, currentUserBalance, contractBalance } = this.state
    return (
      <div id="accounts-sumup">
        <div>
          <h2>My account</h2>
          <p>
            <strong>Public key :</strong>
            {' '}
            {currentUserPublicKey}
          </p>
          <p>
            <strong>Balance :</strong>
            {' '}
            {currentUserBalance}
          </p>
        </div>
        <div>
          <h2>Bet contract</h2>
          <p>
            <strong>Public key :</strong>
            {' '}
            {BetService.getBetContractPubKey()}
          </p>
          <p>
            <strong>Balance :</strong>
            {' '}
            {contractBalance}
          </p>
        </div>
      </div>
    )
  }
}

export default ContractChecker
