import React, { Component } from 'react';
import { Radio, Button } from 'antd';
import BetService from './BetService.js';
import EndMatchForm from './EndMatchForm';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class BetForm extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            bet: {},
            matchResult: {
                willBeAnHomeTeamWin:false,
                willBeADraw:true
            } 
        };
        this.betService = new BetService();
        const methods = [
            this.onChangeBetAmount,
            this.onChangeBetWinningTeam,
            this.bet
        ]
        for (let method of methods) {
            this[method.name] = method.bind(this)
        }
    }

    onChangeBetWinningTeam(e) {
        this.setState({
            bet:{
                ...this.state.bet,
                willBeAnHomeTeamWin:e.target.value === "1",
                willBeADraw: e.target.value === "0",
            }
        })
    }

    onChangeBetAmount(e) {
        this.setState({
            bet: {
                ...this.state.bet,
                amount: e.target.value
            }
        })
    }

    bet() {
        console.log(this.props.selectedMatch, this.state.bet.willBeAnHomeTeamWin, this.state.bet.willBeADraw);
        this.betService.bet(this.props.selectedMatch.id, this.state.bet.willBeAnHomeTeamWin, this.state.bet.willBeADraw, this.state.bet.amount);
    }


    render() {
        const isMatchSelected = this.props.selectedMatch
            ;

        return (
            <div>
                {
                    isMatchSelected ? (
                        <div>
                            <h2>Bet on match {this.props.selectedMatch.libelle}</h2>
                            <form>
                                <div>
                                    <RadioGroup id="betWinningTeamRadio" onChange={this.onChangeBetWinningTeam} defaultValue="0">
                                        <RadioButton value="1">{this.props.selectedMatch.homeTeam} win</RadioButton>
                                        <RadioButton value="0">Equality</RadioButton>
                                        <RadioButton value="-1">{this.props.selectedMatch.externalTeam} win</RadioButton>
                                    </RadioGroup>
                                </div>
                                <br />
                                <label>Montant du pari  </label>
                                <input type="number" name="betAmount" length="2" onChange={this.onChangeBetAmount} />
                                <br /> <br />
                                <Button type="primary" onClick={this.bet}>Parier</Button>
                            </form>

                            <br /> <br />
                            <EndMatchForm selectedMatch={this.props.selectedMatch}></EndMatchForm>
                        </div>
                    ) :
                        (<p>Please select a match to bet on.</p>)
                }
            </div>
        );

    }

}

export default BetForm;
