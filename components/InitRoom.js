import React from "react";
import styled from "styled-components";

import { webRTC } from "../libs/flash"
import { seedGen, startAddresses, closeAddresses } from "../libs/flash/iota";
import { isClient, get, set } from '../libs/utils'
import Flash from "../libs/flash";

export default class extends React.Component {
  state = {
    amountOfTransactions: 100,
    depositAmount: 50
  }

  handleChange(key, event) {
    var obj = {}
    obj[key] = event.target.value
    this.setState(obj)
  }

  createRoom() {
    var mySeed = seedGen(81)
    var amountOfTransactions = parseInt(this.state.amountOfTransactions)
    var depositAmount = parseInt(this.state.depositAmount)
    var settlementAddress = this.state.settlementAddress

    var flashState = Flash.master.initalize(mySeed, amountOfTransactions, depositAmount, settlementAddress)
    var roomData = {
      index: 0, // The creator is always the master
      flashState,
      mySeed
    }
    webRTC.broadcastMessage({
      cmd: 'initRoom',
      flashState
    })
    this.props.callback(roomData)
  }

  render() {
    return (
      <div>
        Max amount of transactions: <input onChange={(e) => { this.handleChange('amountOfTransactions', e) }} type="number" value={this.state.amountOfTransactions}></input><br />
        Deposit amount (both parties enter the equal amount): <input onChange={(e) => { this.handleChange('depositAmount', e) }} type="number" value={this.state.depositAmount}></input> iota
        Settlement address: <input onChange={(e) => { this.handleChange('settlementAddress', e) }} type="text" value={this.state.settlementAddress}></input>

        <br />
        <input value="Create room" onClick={this.createRoom.bind(this)} type="button"></input>
      </div>
    )
  }
}
