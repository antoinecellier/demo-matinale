import React, { Component } from 'react';
import BetService from './BetService.js';


class Bets extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
        this.betService = new BetService();
    }

    render() {
        return (
            <div id="my-bets">
                <h2>My bets</h2>
            </div>
        );
    }

}

export default Bets;