import React, { Component } from 'react'
import BetService from '../services/BetService'


class EventWatcher extends Component {
  constructor(props) {
    super(props)
    this.state = {
      eventLogs: [],
    }
    this.betService = new BetService()
    this.startWatchingEvents = this.startWatchingEvents.bind(this)
    this.stopWatchingEvents = this.stopWatchingEvents.bind(this)
  }

  componentDidMount() {
    this.startWatchingEvents()
  }

  componentWillUnmount() {
    this.stopWatchingEvents()
  }

  startWatchingEvents() {
    const { eventLogs } = this.state
    this.betService.eventSubject.subscribe((event) => {
      console.log('New event', event)
      this.setState({
        eventLogs: eventLogs.concat([event]),
      })
    })
    this.betService.startWatchingEvents()
  }

  stopWatchingEvents() {
    this.betService.eventSubject.unsubscribe()
    this.betService.stopWatchingEvents()
  }


  render() {
    const { eventLogs } = this.state
    return (
      <div id="event-logs">
        <h2>Smart contract events</h2>
        {eventLogs.map((event, index) =>
          <p key={`${event}-${index + 1}`}>{event}</p>)}
      </div>
    )
  }
}

export default EventWatcher
