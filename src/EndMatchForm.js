import React, { Component } from 'react';
import { Radio, Button } from 'antd';
import BetService from './BetService.js';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


class EndMatchform extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hasHomeWon: false,
            wasThereEquality: true
        };
        this.betService = new BetService();
        const methods = [
            this.onChangeMatchResult,
            this.endMatch
        ]
        for (let method of methods) {
            this[method.name] = method.bind(this)
        }
    }


    onChangeMatchResult(event) {
        this.setState({
            hasHomeWon: event.target.value === "1",
            wasThereEquality: event.target.value === "0" 
        });
    }

    endMatch() {
        this.betService.resolveMatch(this.props.selectedMatch.id, this.state.hasHomeWon, this.state.wasThereEquality);
    }


    render() {
        return (
            <form>
                <h2>Enter match {this.props.selectedMatch.libelle} result</h2>
                <div>
                    <RadioGroup id="matchResultRadio" onChange={this.onChangeMatchResult} defaultValue="0">
                        <RadioButton value="1">{this.props.selectedMatch.homeTeam} has won</RadioButton>
                        <RadioButton value="0">Equality</RadioButton>
                        <RadioButton value="-1">{this.props.selectedMatch.externalTeam} has won</RadioButton>
                    </RadioGroup>
                </div>
                <br></br>
                <Button type="primary" onClick={this.endMatch}>End match</Button>
            </form>
        );
    }

}

export default EndMatchform;