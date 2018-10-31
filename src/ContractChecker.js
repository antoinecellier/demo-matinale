import React, { Component } from 'react';
import BetService from './BetService.js';

class ContractChecker extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.getCurrentUserBalance = this.getCurrentUserBalance.bind(this);
        this.getContractAccountBalance = this.getContractAccountBalance.bind(this);
        this.getCurrentUserPublicKey = this.getCurrentUserPublicKey.bind(this);
        this.betService = new BetService();
    }

    getCurrentUserPublicKey() {
        this.setState({
            currentUserPublicKey: this.betService.getCurrentEthereumAccountPubKey()
        })
    }

    getCurrentUserBalance() {
        this.betService.getBalance(this.betService.getCurrentEthereumAccountPubKey()).then(result => {
            this.setState({
                currentUserBalance: result
            })
        });
    }

    getContractAccountBalance() {
        this.betService.getBalance(this.betService.getBetContractPubKey()).then(result => {
            this.setState({
                contractBalance: result
            })
        });
    }

    render() {
        return (
            <div id="accounts-sumup">
                <div>
                    <h2>My account</h2>
                    <p><strong>Public key :</strong> {this.state.currentUserPublicKey}</p>
                    <p><strong>Balance :</strong> {this.state.currentUserBalance}</p>
                </div>
                <div>
                    <h2>Bet contract</h2>
                    <p><strong>Public key :</strong> {this.betService.getBetContractPubKey()}</p>
                    <p><strong>Balance :</strong> {this.state.contractBalance}</p>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.setState({
            contractAccountInterval: setInterval(this.getContractAccountBalance, 5000),
            currentUserBalanceInterval: setInterval(this.getCurrentUserBalance, 5000),
            currentUserPublicKeyInterval: setInterval(this.getCurrentUserPublicKey, 5000)
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.contractAccountInterval);
        clearInterval(this.state.currentUserBalanceInterval);
        clearInterval(this.state.currentUserPublicKeyInterval);
    }
}

export default ContractChecker;