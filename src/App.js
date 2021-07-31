import logo from './logo.svg';
import React, { useState } from "react";
import './App.css';
import { eventWager } from './abi/abi';
import { token } from './abi/abi';
import Web3 from "web3";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const web3 = new Web3(Web3.givenProvider);
const contractAddress = "0x73A6Da02A8876C3E01017fB960C912dA0a423817";
const tokenAddress = "0x02F682030814F5AE7B1b3d69E8202d5870DF933f";
const eventWagerContract = new web3.eth.Contract(eventWager, contractAddress);
const tokenContract = new web3.eth.Contract(token, tokenAddress);

function App() {
  // Getter hooks
  const [retrievedWager, setRetrievedWager] = useState(0);
  const [currentPot, setRetrievedCurrentPot] = useState(0);
  const [potFor, setPotFor] = useState(0);
  const [potAgainst, setPotAgainst] = useState(0);
  const [retrievedUserSide, setRetrievedUserSide] = useState(0);
  const [retrievedSide1, setRetrievedSide1] = useState("1");
  const [retrievedSide2, setRetrievedSide2] = useState("2");
  const [requestAddress, setRequestAddress] = useState(0);
  const [requestAmount, setRequestAmount] = useState(0);

  // Setter hooks
  const [newWager, setWager] = useState(0);
  const [userSide, setUserSide] = useState(0);
  const [winningSide, setWinningSide] = useState(0);

  // Getter methods
  const getUserWager = async (t) => {
    t.preventDefault();
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    const post = await eventWagerContract.methods.getWager(account).call();
    const _wager = web3.utils.fromWei(post);
    setRetrievedWager(_wager);
  };

  const renderUserWager = async () => {
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    const post = await eventWagerContract.methods.getWager(account).call();
    const _wager = web3.utils.fromWei(post);
    setRetrievedWager(_wager);
  };

  const getCurrentPot = async (t) => {
    t.preventDefault();
    const post = await eventWagerContract.methods.getPot().call();
    const _pot = web3.utils.fromWei(post);
    setRetrievedCurrentPot(_pot);
  };

  const renderCurrentPot = async () => {
    const post = await eventWagerContract.methods.getPot().call();
    const _pot = web3.utils.fromWei(post);
    setRetrievedCurrentPot(_pot);
  };

  const getCurrentSides = async (t) => {
    t.preventDefault();
    const post = await eventWagerContract.methods.getSides().call();
    // const post = await eventWagerContract.methods.getPot().call();
    var substrings = post.split('||&&||');
    setRetrievedSide1(substrings[0]);
    setRetrievedSide2(substrings[1]);
    // return false;
  };

  const renderSides = async () => { // Same as getCurrentSides, except it takes no context argument
    const post = await eventWagerContract.methods.getSides().call();
    var substrings = post.split('||&&||');
    setRetrievedSide1(substrings[0]);
    setRetrievedSide2(substrings[1]);
  };

  const getUserSide = async (t) => {
    t.preventDefault();
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    const post = await eventWagerContract.methods.getUserSide(account).call();
    setRetrievedUserSide(post);
  };

  const getPotFor = async (t) => {
    t.preventDefault();
    const post = await eventWagerContract.methods.getPotFor().call();
    setPotFor(web3.utils.fromWei(post));
  };

  const renderPotFor = async (t) => {
    const post = await eventWagerContract.methods.getPotFor().call();
    setPotFor(web3.utils.fromWei(post));
  };

  const getPotAgainst = async (t) => {
    t.preventDefault();
    const post = await eventWagerContract.methods.getPotAgainst().call();
    setPotAgainst(web3.utils.fromWei(post));
  };

  const renderPotAgainst = async (t) => {
    const post = await eventWagerContract.methods.getPotAgainst().call();
    setPotAgainst(web3.utils.fromWei(post));
  };
  

  // Setter methods
  const wager = async (t) => {
    t.preventDefault();
    try{
      const accounts = await window.ethereum.enable();
      const account = accounts[0];
      const _wager = web3.utils.toWei(newWager);

      const gas = await eventWagerContract.methods.wager(userSide, _wager).estimateGas();
      const post = await eventWagerContract.methods.wager(userSide, _wager).send({ from: account, gas });
      getUserWager(t);
      getCurrentPot(t);
    }
    catch(e)
    {
      alert('Apparently this is the best way to display blockchain errors :/\n\n' + e.message);
    }
    var form = document.getElementById("submitWagerForm");
    form.reset();
  };

  const endRound = async (t) => {
    t.preventDefault();
    try{
      const accounts = await window.ethereum.enable();
      const account = accounts[0];
      const gas = await eventWagerContract.methods.endRound(winningSide).estimateGas();
      const post = await eventWagerContract.methods.endRound(winningSide).send({ from: account, gas });
    }
    catch(e)
    {
      alert('Apparently this is the best way to display blockchain errors :/\n\n' + e.message);
    }
    var form = document.getElementById("endRoundForm");
    form.reset();
  };

  const beginRound = async (t) => {
    t.preventDefault();
    setRetrievedSide1(document.getElementById("side1").value);
    setRetrievedSide2(document.getElementById("side2").value);
    try{
      const accounts = await window.ethereum.enable();
      const account = accounts[0];
      const gas = await eventWagerContract.methods.beginRound(retrievedSide1, retrievedSide2).estimateGas();
      const post = await eventWagerContract.methods.beginRound(retrievedSide1, retrievedSide2).send({ from: account, gas });
    }
    catch(e)
    {
      alert('Apparently this is the best way to display blockchain errors :/\n\n' + e.message);
    }
    var form = document.getElementById("beginRoundForm");
    form.reset();
  };

  const closeBetting = async (t) => {
    t.preventDefault();
    try{
      const accounts = await window.ethereum.enable();
      const account = accounts[0];
      const gas = await eventWagerContract.methods.closeBetting().estimateGas();
      const post = await eventWagerContract.methods.closeBetting().send({from: account, gas });
    }
    catch(e)
    {
      // let i = e.message.indexOf('{');
      // console.log(e.message.substring(i));
      // let err = JSON.parse(e.message.substring(i).trim()).message;
      alert('Apparently this is the best way to display blockchain errors :/\n\n' + e.message);
    }
  };

  const allowSpend = async (t) => {
    t.preventDefault();
    try{
      const accounts = await window.ethereum.enable();
      const account = accounts[0];
      // (2**256)-1)
      // let amnt = new BigNumber(999 * (10**18));
      // let _amnt = await amnt.toString();
      // console.log(_amnt);
      const gas = tokenContract.methods.approve(contractAddress, web3.utils.toWei('9999')).estimateGas();
      const post = tokenContract.methods.approve(contractAddress, web3.utils.toWei('9999')).send({ from: account });
    }
    catch(e)
    {
      alert('Apparently this is the best way to display blockchain errors :/\n\n' + e.message);
    }
  };

  const requestTokens = async (t) => {
    t.preventDefault();
    try {
      const accounts = await window.ethereum.enable();
      const account = accounts[0];
      const gas = eventWagerContract.methods.requestTokens(requestAddress, web3.utils.toWei(requestAmount)).estimateGas();
      const post = eventWagerContract.methods.requestTokens(requestAddress, web3.utils.toWei(requestAmount)).send({ from: account });
    }
    catch(error) {
      console.log(error);
      console.log('Error Caught!');
      alert(error);
    }
    
    var form = document.getElementById("requestTokensForm");
    form.reset();
  };
  

  // Helper methods
  const networkCheck = async () => { // Check if metamask is connected to Ropsten or Ganache
    var appNetwork = await web3.eth.net.getNetworkType();
    let netId = await web3.eth.net.getId();
    if(appNetwork !== 'ropsten' && netId !== 1627753267457) {
      alert('Please ensure that your wallet is connected to the Ropsten test network');
    }
    console.log(appNetwork);
    console.log(netId);
  };

  const renderValues = async () => {
    renderSides();
    renderPotFor();
    renderPotAgainst();
    renderCurrentPot();
    renderUserWager();
  };

  // Call render functions on page load
  renderSides();
  renderPotFor();
  renderPotAgainst();
  renderCurrentPot();
  renderUserWager();
  networkCheck();

  // Listener methods
  eventWagerContract.events.Wager().on('data', (event) => {
    renderValues();
  }).on('error', console.error);

  eventWagerContract.events.RoundStart().on('data', (event) => {
    renderValues();
  }).on('error', console.error);

  eventWagerContract.events.BettingClosed().on('data', (event) => {
    renderValues(); // TODO this should do something more. The user should be able to tell the state
  }).on('error', console.error);

  eventWagerContract.events.RoundEnd().on('data', (event) => {
    renderValues();
  }).on('error', console.error);

  eventWagerContract.events.PassOwnership().on('data', (event) => {
    renderValues(); // TODO This should do something entireley different
  }).on('error', console.error);


  const Home = () => {
    return(
      <div className="main">
      <div className="upper">
      1: {retrievedSide1} : {potFor} WC<br/> 2: {retrievedSide2} : {potAgainst} WC
      </div>
      <div className="card">
        <form className="form" id="submitWagerForm" autocomplete="off" onSubmit={wager}>
          <label>
            Enter your wager and side:
            <br />
            <input
              className="input"
              type="text"
              name="amount"
              placeholder="# of WC"
              onChange={(t) => setWager(t.target.value)}
            />
            <input
              className="input"
              type="text"
              name="side"
              placeholder="1 or 2"
              onChange={(t) => setUserSide(t.target.value)}
            />
          </label>
          <button className="button" type="submit" value="Submit">
            Submit
          </button>
        </form>
        <br />
        <div>
          <button className="button" onClick={getUserWager} type="button">
            Your current wager: 
          </button>
            {retrievedWager}
        </div>
        <br /> <br />
        <div>
          <button className="button" onClick={getCurrentPot} type="button">
            Click for current pot
          </button>
          {currentPot}
        </div>
        <br /><br />
        <div>
          <button className="button" onClick={allowSpend} type="button">
              Click to approve
          </button>
        </div>
      <div className="lower">
        <form className="form" onSubmit={getCurrentSides}>
          <label>
              <button className="button" type="submit" value="Submit">
                Get Sides
              </button>
            </label>
          </form>
        </div>
      </div>
    </div>
    );
  }

  const Admin = () => {
    return(
      <div className="main">
      <div className="upper">
        1: {retrievedSide1} : {potFor} WC<br/> 2: {retrievedSide2} : {potAgainst} WC
      </div>
      <div className="card">
        <form className="form" id="submitWagerForm" autocomplete="off" onSubmit={wager}>
          <label>
            Enter your wager and side:
            <br />
            <input
              className="input"
              type="text"
              name="amount"
              placeholder="# of WC"
              onChange={(t) => setWager(t.target.value)}
            />
            <input
              className="input"
              type="text"
              name="side"
              placeholder="1 or 2"
              onChange={(t) => setUserSide(t.target.value)}
            />
          </label>
          <button className="button" type="submit" value="Submit">
            Submit
          </button>
        </form>
        <br />
        <div>
          <button className="button" onClick={getUserWager} type="button">
            Your current wager: 
          </button>
            {retrievedWager}
        </div>
        <br /> <br />
        <div>
          <button className="button" onClick={getCurrentPot} type="button">
            Click for current pot
          </button>
          {currentPot}
        </div>
        <br /><br />
        <div>
          <button className="button" onClick={allowSpend} type="button">
              Click to approve
          </button>
        </div>
        <div className="lower">
          <form className="form" id="beginRoundForm" autocomplete="off" onSubmit={beginRound}>
            <label>
              <input
                className="input"
                type="text"
                name="name"
                id="side1"
                placeholder="Side 1"
                onChange={(t) => setRetrievedSide1(t.target.value)}
              />
              <input
                className="input"
                type="text"
                name="side"
                placeholder="Side 2"
                id="side2"
                onChange={(t) => setRetrievedSide2(t.target.value)}
              />
              <button className="button" type="submit" value="Submit">
                Begin Round
              </button>
            </label>
          </form>
          <form className="form" id="endRoundForm" autocomplete="off" onSubmit={endRound}>
          <label>
            <input
                className="input"
                type="text"
                name="side"
                placeholder="Winning Side"
                onChange={(t) => setWinningSide(t.target.value)}
              />
              <button className="button" type="submit" value="Submit">
                End Round
              </button>
            </label>
          </form>
          <form className="form" id="requestTokensForm" autocomplete="off" onSubmit={requestTokens}>
            <label>
              <input
                className="input"
                type="text"
                name="name"
                placeholder="0x address"
                onChange={(t) => setRequestAddress(t.target.value)}
              />
              <input
                className="input"
                type="text"
                name="side"
                placeholder="Amount"
                onChange={(t) => setRequestAmount(t.target.value)}
              />
              <button className="button" type="submit" value="Submit">
                Request Tokens
              </button>
            </label>
          </form>
      </div>
      <div className="lower">
        <form className="form" onSubmit={getCurrentSides}>
          <label>
              <button className="button" type="submit" value="Submit">
                Get Sides
              </button>
            </label>
          </form>
          <form className="form" onSubmit={closeBetting}>
            <label>
              <button className="button" type="submit" value="Submit">
                Close Betting
              </button>
            </label>
          </form>
        </div>
      </div>
    </div>
    );
  }

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/admin">
          <Admin />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

/*
TODO
Make a more meaningful top bar 'Side' - Pot 
*/