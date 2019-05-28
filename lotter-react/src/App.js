import {Component} from 'react';
import React from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';

import lottery from './lottery'
import { async } from 'q';


class App extends Component {
  
  state = {

    manager : '',
    players: [],
    balance: '',
    value: '',
    message:''
  }

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager , players, balance})
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    
    this.setState({message: 'waiting on transaction to complete...'})
    await lottery.methods.enter().send({

      from: accounts[0], 
      value: web3.utils.toWei(this.state.value,'ether')
    })
    

    this.setState({message: 'transaction has been completed...'})
  }

  onClick = async(event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({message: 'Waiting on to choose winner ...'})

    await lottery.methods.pickWinner().send({

      from: accounts[0]
    })

    this.setState({message: ' winner has been picked'})

  }
  
  render() {
  return (
    <div className="app">
      
        <h2>Lotter Contract</h2>
        <h2>{this.state.manager}</h2>

        <p>There are currently {this.state.players.length} that are competeting to win {web3.utils.fromWei(this.state.balance,'ether')} Ether!!!</p>
     
      <hr/>

      <form onSubmit={this.onSubmit}>

        <h4>Want to try your luck ??</h4>
        <div>

          <label>Amount of ether to enter </label>

          <input 
            value = {this.state.value}
            onChange = {event => this.setState({value: event.target.value})}
          />

          </div>
            <button>Enter</button>
        
      </form>
      <hr/>

      <h4>Ready to pick a winner</h4>
      <button onClick={this.onClick}>click to pick winner</button>
       <p>{this.state.message}</p>

       
    </div>
  );
}
}
export default App;
