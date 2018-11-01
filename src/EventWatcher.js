import React, { Component } from 'react';
import BetService from './BetService.js';


class EventWatcher extends Component {

    constructor(props) {
        super(props);
        this.state = {
            eventLogs: []
        };
        this.betService = new BetService();
        this.startWatchingEvents = this.startWatchingEvents.bind(this);
        this.stopWatchingEvents = this.stopWatchingEvents.bind(this);
    }

    startWatchingEvents() {
        this.betService.eventSubject.subscribe(event => {
            console.log("New event", event);
            this.setState({
                eventLogs: this.state.eventLogs.concat([event])
            });
        });
        this.betService.startWatchingEvents();
    }

    stopWatchingEvents(){
        this.betService.eventSubject.unsubscribe();
        this.betService.stopWatchingEvents();
    }


    render() {
        return (
            <div id="event-logs">
                <h2>Smart contract events</h2>
                {this.state.eventLogs.map((event, index) =>
                    <p key={index}>{event}</p>
                )}

            </div>
        );
    }

    componentDidMount() {
        this.startWatchingEvents();
    }

    componentWillUnmount() {
        this.stopWatchingEvents();
    }

}

export default EventWatcher;