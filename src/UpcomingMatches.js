import React, { Component } from 'react';
import BetService from './BetService.js';


class UpcomingMatches extends Component {

    constructor(props) {
        super(props);
        this.state = { matchs: [] };
        this.betService = new BetService();
        this.retrieveMatchs = this.retrieveMatchs.bind(this);
    }

    selectedMatchUpdate(selectedMatch) {
        this.props.callback(selectedMatch);
        this.setState({
            selectedMatch: this.state.matchs.find(match => match.libelle === selectedMatch.libelle)
        });
    }

    retrieveMatchs() {
        this.betService.getMatchesToBetOn().then(results => {
            this.setState({
                matchs: results
            })
        });
    }

    render() {
        return (
            <div id="next-matches">
                <h2>Upcoming matches</h2>
                <ul>
                    {this.state.matchs.map(match =>
                        <li key={match.id}><a onClick={this.selectedMatchUpdate.bind(this, match)}><strong>{match.libelle}</strong>({match.homeTeam} - {match.externalTeam})</a></li>
                    )}
                </ul>

            </div>
        );
    }

    componentDidMount() {
        this.setState({
            matchUpdateInterval: setInterval(this.retrieveMatchs, 5000)
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.matchUpdateInterval);
    }

}

export default UpcomingMatches;