import React, { Component } from 'react'
import { Radio, Button } from 'antd'
import BetService from '../services/BetService'

const RadioButton = Radio.Button
const RadioGroup = Radio.Group


class MatchCreationForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      match: {},
    }
    const methods = [
      this.onChangeMatchHomeTeam,
      this.onChangeMatchExternalTeam,
      this.onChangeMatchLabel,
      this.onChangeMatchHomeVictoryQuotation,
      this.createMatch,
    ]
    methods.forEach((method) => {
      this[method.name] = method.bind(this)
    })
    this.betService = new BetService()
  }

  onChangeMatchHomeTeam(e) {
    const { match } = this.state
    this.setState({
      match: {
        ...match,
        homeTeam: e.target.value,
      },
    })
  }

  onChangeMatchExternalTeam(e) {
    const { match } = this.state
    this.setState({
      match: {
        ...match,
        externalTeam: e.target.value,
      },
    })
  }

  onChangeMatchLabel(e) {
    const { match } = this.state
    this.setState({
      match: {
        ...match,
        label: e.target.value,
      },
    })
  }

  onChangeMatchHomeVictoryQuotation(e) {
    const { match } = this.state
    this.setState({
      match: {
        ...match,
        homeVictoryQuotation: e.target.value,
      },
    })
  }

  createMatch() {
    const {
      match: {
        homeTeam, externalTeam, label, homeVictoryQuotation,
      },
    } = this.state
    this.betService.createMatch(
      homeTeam, externalTeam, label, new Date().getTime(), homeVictoryQuotation,
    )
  }

  render() {
    return (
      <form id="creationMatch">
        <h2>Créer match</h2>
        <label htmlFor="matchLabel"> Titre match : </label>
        {' '}
        <input id="matchLabel" type="text" onChange={this.onChangeMatchLabel} />
        <div id="match-fields">
          <label htmlFor="homeTeam"> Home team </label>
          <label htmlFor="externalTeam"> External team </label>
          <input id="homeTeam" type="text" onChange={this.onChangeMatchHomeTeam} />
          {' '}
-
          {' '}
          <input id="externalTeam" type="text" onChange={this.onChangeMatchExternalTeam} />
          <label htmlFor="homeVictoryQuotation"> Home victory quotation </label>
          <RadioGroup id="homeVictoryQuotation" onChange={this.onChangeMatchHomeVictoryQuotation} defaultValue="3">
            <RadioButton value="1.50">1.50</RadioButton>
            <RadioButton value="3">3</RadioButton>
            <RadioButton value="4.5">4.5</RadioButton>
          </RadioGroup>
        </div>
        <Button id="createMatch" type="primary" onClick={this.createMatch}>Créer le match!</Button>
      </form>
    )
  }
}

export default MatchCreationForm
