import React, { useState, useRef } from "react";
import './App.css';
import { eventWager } from './abi/abi';
import { token } from './abi/abi';
import Web3 from "web3";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@material-ui/core';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// Images for the French project
import caenskyline from './images/caen-skyline.png';
import caenmusee from './images/caen-musee.jpeg';
import caenchateau from './images/caen-chateau.png';
import rouensquare from './images/rouen-square.png';
import rouennotredame from './images/rouen-notredame.png';
import rouenjardin from './images/rouen-jardin.png';
import lehavreskyline from './images/lehavre-skyline.png';
import lehavremuma from './images/lehavre-muma2.png';
import lehavremarina from './images/lehavre-marina.png';
import sean from './images/sean.jpg'
import metadata from './test_metadata.json'
import bayc from './bayc.json'


const web3 = new Web3(Web3.givenProvider);
// const contractAddress = "0x73A6Da02A8876C3E01017fB960C912dA0a423817"; // Ganache
// const tokenAddress = "0x02F682030814F5AE7B1b3d69E8202d5870DF933f"; // Ganache
// const contractAddress = "0x011A4e19CE1dC370068869412cd6964f7787B2a7"; // Ropsten
// const tokenAddress = "0x9D14FAaAA23EE94245e256fA834764B6999F42D5"; // Ropsten

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
 }));

function App() {

  const classes = useStyles();
  const [number, setUint] = useState(0);
  const [getNumber, setGet] = useState("0");
  

  // Input Refs
  const side1ref = useRef(null);
  const side2ref = useRef(null);
  const adminWagerAmountRef = useRef(null);
  const adminWagerSideRef = useRef(null);
  const homeWagerAmountRef = useRef(null);
  const homeWagerSideRef = useRef(null);
  const winningSideRef = useRef(null);
  const requestAddressRef = useRef(null);
  const requestAmountRef = useRef(null);
  const changeTokenRef = useState(null)
  const changeContractRef = useState(null)
  const homeRadioRef1 = useRef(null);
  const homeRadioRef2 = useRef(null);
  const adminRadioRef1 = useRef(null);
  const adminRadioRef2 = useRef(null);

  // Getter hooks
  const [retrievedWager, setRetrievedWager] = useState(0);
  const [currentPot, setRetrievedCurrentPot] = useState(0);
  const [potFor, setPotFor] = useState(0);
  const [potAgainst, setPotAgainst] = useState(0);
  const [retrievedUserSide, setRetrievedUserSide] = useState(0);
  const [retrievedSide1, setRetrievedSide1] = useState("");
  const [retrievedSide2, setRetrievedSide2] = useState("");
  const [requestAddress, setRequestAddress] = useState(0);
  const [requestAmount, setRequestAmount] = useState(0);
  const [owner, setOwner] = useState("");
  const [state, setState] = useState(0);
  const [tokenAddress, setTokenAddress] = useState("0x9D14FAaAA23EE94245e256fA834764B6999F42D5");
  const [contractAddress, setContractAddress] = useState("0x011A4e19CE1dC370068869412cd6964f7787B2a7");

  const eventWagerContract = new web3.eth.Contract(eventWager, contractAddress);
  const tokenContract = new web3.eth.Contract(token, tokenAddress);

  // Setter hooks
  const [newWager, setWager] = useState(0);
  const [userSide, setUserSide] = useState(0);
  const [winningSide, setWinningSide] = useState(0);

  // Getter methods
  const getUserWager = async (t) => {
    if(t) { t.preventDefault(); }
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    const post = await eventWagerContract.methods.getWager(account).call();
    const _wager = web3.utils.fromWei(post);
    setRetrievedWager(_wager);
  };

  const getState = async (t) => {
    if(t) { t.preventDefault(); }
    const post = await eventWagerContract.methods.getState().call();
    var _state = state;
    // if(_state === 'null'){ _state = ''; }
    // console.log('_state' + _state);
    // setState(state);
    setState(post);
  }

  const getOwner = async (t) => {
    if(t) { t.preventDefault(); }
    const post = await eventWagerContract.methods.getOwner().call();
    setOwner(post);
  }

  const getCurrentPot = async (t) => {
    if(t) { t.preventDefault(); }
    const post = await eventWagerContract.methods.getPot().call();
    const _pot = web3.utils.fromWei(post);
    setRetrievedCurrentPot(_pot);
  };

  const getCurrentSides = async (t) => {
    if(t) { t.preventDefault(); }
    const post = await eventWagerContract.methods.getSides().call();
    // const post = await eventWagerContract.methods.getPot().call();
    var substrings = post.split('||&&||');
    setRetrievedSide1(substrings[0]);
    setRetrievedSide2(substrings[1]);
    // return false;
  };

  const getUserSide = async (t) => {
    if(t) { t.preventDefault(); }
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    const post = await eventWagerContract.methods.getUserSide(account).call();
    setRetrievedUserSide(post);
  };

  const getPotFor = async (t) => {
    if(t) { t.preventDefault(); }
    const post = await eventWagerContract.methods.getPotFor().call();
    setPotFor(web3.utils.fromWei(post));
  };

  const getPotAgainst = async (t) => {
    if(t) { t.preventDefault(); }
    const post = await eventWagerContract.methods.getPotAgainst().call();
    setPotAgainst(web3.utils.fromWei(post));
  };
  
  // Setter methods
  const wager = async (t) => {
    t.preventDefault(); 
    var _amount = homeWagerAmountRef.current.value;
    var _side;
    if(homeRadioRef1.current.checked) { _side = 1; }
    else if(homeRadioRef2.current.checked) { _side = 2; }
    
    try{
      const accounts = await window.ethereum.enable();
      const account = accounts[0];
      console.log('amount : ' + _amount + ' side : ' + _side);
      const gas = await eventWagerContract.methods.wager(_side, web3.utils.toWei(_amount)).estimateGas({ from: account});
      console.log(_side);
      const post = await eventWagerContract.methods.wager(_side, web3.utils.toWei(_amount)).send({ from: account, gas });
    }
    catch(e)
    {
      // TODO handle the errors.. I can do JSON parse in a try-catch
      alert('Apparently this is the best way to display blockchain errors :/\n\n' + e.message);
    }
    var form = document.getElementById("submitWagerForm");
    form.reset();
  };

  const adminWager = async (t) => {
    t.preventDefault(); 
    var _amount = adminWagerAmountRef.current.value;
    var _side;
    if(homeRadioRef1.current.checked) { _side = 1; }
    else if(homeRadioRef2.current.checked) { _side = 2; }
    
    try{
      const accounts = await window.ethereum.enable();
      const account = accounts[0];
      console.log('amount : ' + _amount + ' side : ' + _side);
      const gas = await eventWagerContract.methods.wager(_side, web3.utils.toWei(_amount)).estimateGas({ from: account});
      console.log(1);
      const post = await eventWagerContract.methods.wager(_side, web3.utils.toWei(_amount)).send({ from: account, gas });
      console.log(2);
    }
    catch(e)
    {
      alert('Apparently this is the best way to display blockchain errors :/\n\n' + e.message);
    }
    var form = document.getElementById("submitWagerForm");
    form.reset();
  };

  const endRound = async (t) => {
    if(t) { t.preventDefault(); }
    var _winningSide = winningSideRef.current.value;
    try{
      const accounts = await window.ethereum.enable();
      const account = accounts[0];
      const gas = await eventWagerContract.methods.endRound(_winningSide).estimateGas({ from: account });
      const post = await eventWagerContract.methods.endRound(_winningSide).send({ from: account, gas });
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
    setRetrievedSide1(side1ref.current.value);
    setRetrievedSide2(side2ref.current.value);
    var _side1 = side1ref.current.value;
    var _side2 = side2ref.current.value;
    try{
      const accounts = await window.ethereum.enable();
      const account = accounts[0];
      const gas = await eventWagerContract.methods.beginRound(_side1, _side2).estimateGas({from: account});
      const post = await eventWagerContract.methods.beginRound(_side1, _side2).send({ from: account, gas });
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
      const gas = await eventWagerContract.methods.closeBetting().estimateGas({from: account});
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
      console.log('account : ' + account);
      const gas = tokenContract.methods.approve(contractAddress, web3.utils.toWei('999999')).estimateGas({ from: account });
      const post = tokenContract.methods.approve(contractAddress, web3.utils.toWei('999999')).send({ from: account });
      console.log('account_ : ' + account);
    }
    catch(e)
    {
      alert('Apparently this is the best way to display blockchain errors :/\n\n' + e.message);
    }
  };

  const requestTokens = async (t) => {
    t.preventDefault();
    var _requestAddress = requestAddressRef.current.value;
    var _requestAmount = requestAmountRef.current.value;
    try {
      const accounts = await window.ethereum.enable();
      const account = accounts[0];
      const gas = eventWagerContract.methods.requestTokens(_requestAddress, web3.utils.toWei(_requestAmount)).estimateGas({from: account});
      const post = eventWagerContract.methods.requestTokens(_requestAddress, web3.utils.toWei(_requestAmount)).send({ from: account });
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
    // console.log(appNetwork);
    // console.log(netId);
  };

  const changeAddress = async (t) => {
    t.preventDefault();
    var _contract = changeContractRef.current.value;
    var _token = changeTokenRef.current.value;

    try{ 
      if(_contract.charAt(1) === 'x') {
        setContractAddress(_contract);
    }
    if(_token.charAt(1) === 'x') 
        setTokenAddress(_token);
    }
    catch(e){ alert(e); }
  };

  const renderValues = async () => {
    getState();
    getCurrentSides();
    getPotFor();
    getPotAgainst();
    getCurrentPot();
    getUserWager();
    getOwner();
  };

  const isAbout = async () => {
    if(window.location.href.includes('about')) { return true; }
    else { return false; }
  }

  // Load values from blockchain on page load
  // if(window.location.href.charAt(window.location.href.length - 1) != 't')
  if(!isAbout())
  {
    networkCheck(); 
    renderValues();
  }

  // Listener methods
  eventWagerContract.events.Wager().on('data', (event) => {
    if(!isAbout())
    {
     renderValues();
    }
  }).on('error', console.error);

  eventWagerContract.events.RoundStart().on('data', (event) => {
    if(!isAbout())
    {
     renderValues();
    }
  }).on('error', console.error);

  eventWagerContract.events.BettingClosed().on('data', (event) => {
    if(!isAbout())
    {
     renderValues();
    } // TODO this should do something more. The user should be able to tell the state
  }).on('error', console.error);

  eventWagerContract.events.RoundEnd().on('data', (event) => {
    if(!isAbout())
    {
     renderValues();
    }
  }).on('error', console.error);

  eventWagerContract.events.PassOwnership().on('data', (event) => {
    if(!isAbout())
    {
     renderValues();
    } // TODO This should do something entireley different
  }).on('error', console.error);


  const Home = () => {
    return(
      <React.Fragment>
        <div classname={classes.root}>
          <div className="main">
              <div className="upper">
                <div className="upperElement">
                  {retrievedSide1} : {potFor} WC<br/>{retrievedSide2} : {potAgainst} WC
                </div>
                <div className="upperElement">
                  State: {state}
                  <br/>
                  Your wager: {retrievedWager}
                </div>
            </div>
            <div className="potBanner"> Current pot: {currentPot} </div>
            <div className="card">
              <form className="form" id="submitWagerForm" autocomplete="off" onSubmit={wager}>
                <label>
                  Enter your wager and side:
                  <br />
                  <TextField
                    inputRef={homeWagerAmountRef}
                    // ref={homeWagerAmountRef}
                    id="outlined-basic"
                    variant="outlined"
                    className="input"
                    type="text"
                    name="amount"
                    placeholder="# of WC"
                    // onChange={(t) => setWager(t.target.value)}
                  />
                  <RadioGroup className="radioGroup" row name="sidegroup">
                    <FormControlLabel className="radio" value="side1" control={<Radio />} label={retrievedSide1} inputRef={homeRadioRef1}/>
                    <FormControlLabel className="radio" value="side2" control={<Radio />} label={retrievedSide2} inputRef={homeRadioRef2}/>
                  </RadioGroup>
                </label>
                <div>
                  <Button className="button" variant="contained" type="submit" color="primary" value="Submit">
                    Submit
                  </Button>
                </div>
              </form>
            <div>
              <form className="form" id="approveForm" value="Submit">
                <Button className="button" variant="contained" color="secondary" onClick={allowSpend} type="button">
                    Click to approve
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
    );
  }

  const Admin = () => {
    return(
      <div className="main">
        <div className="upper">
            <div className="upperElement">
              1: {retrievedSide1} : {potFor} WC<br/>2: {retrievedSide2} : {potAgainst} WC
            </div>
          <div className="upperElement">
            State: {state}<br/>Your wager: {retrievedWager}
          </div>
        </div>
        <div className="addressBanner">
          Owner: {owner}
        </div>
        <div className="card">
          <form className="form" id="submitWagerForm" autocomplete="off" onSubmit={adminWager}>
            <label>
              Enter your wager and side:
              <br />
              <TextField
                    inputRef={adminWagerAmountRef}
                    // ref={homeWagerAmountRef}
                    id="outlined-basic"
                    variant="outlined"
                    className="input"
                    type="text"
                    name="amount"
                    placeholder="# of WC"
                    // onChange={(t) => setWager(t.target.value)}
                  />
                  <RadioGroup className="radioGroup" row name="sidegroup">
                    <FormControlLabel className="radio" value="side1" control={<Radio />} label={retrievedSide1} inputRef={adminRadioRef1}/>
                    <FormControlLabel className="radio" value="side2" control={<Radio />} label={retrievedSide2} inputRef={adminRadioRef2}/>
                  </RadioGroup>
            </label>
            <div>
              <Button className="button" variant="contained" color="primary" type="submit"  value="Submit">
                Submit
              </Button>
            </div>
          </form>
          <div>
              <Button className="button" variant="contained" color="secondary" onClick={allowSpend} type="button">
                  Click to approve
              </Button>
        </div>
        <div className="lower">
          <form className="form" id="beginRoundForm" autocomplete="off" onSubmit={beginRound}>
            <label>
              <TextField
                className="input"
                variant="outlined"
                inputRef={side1ref}
                type="text"
                name="name"
                // value={retrievedSide1}
                id="side1"
                placeholder="Side 1"
                // onChange={(t) => setRetrievedSide1(t.target.value)}
              />
              <TextField
                className="input"
                variant="outlined"
                inputRef={side2ref}
                type="text"
                name="side"
                placeholder="Side 2"
                // value={retrievedSide2}
                id="side2"
                // onChange={(t) => setRetrievedSide2(t.target.value)}
              />
              <Button className="button" variant="outlined" color="primary" type="submit" value="Submit">
                Begin Round
              </Button>
            </label>
          </form>
          <form className="form" id="endRoundForm" autocomplete="off" onSubmit={endRound}>
          <label>
            <TextField
                inputRef={winningSideRef}
                className="input"
                variant="outlined"
                type="text"
                name="side"
                placeholder="Winning Side"
                // value={winningSide}
                // onChange={(t) => setWinningSide(t.target.value)}
              />
              <Button className="button" variant="outlined" color="primary" type="submit" value="Submit">
                End Round
              </Button>
            </label>
          </form>
          <form className="form" id="requestTokensForm" autocomplete="off" onSubmit={requestTokens}>
            <label>
              <TextField
                inputRef={requestAddressRef}
                variant="outlined"
                className="input"
                type="text"
                name="name"
                placeholder="0x address"
                // onChange={(t) => setRequestAddress(t.target.value)}
              />
              <TextField
                inputRef={requestAmountRef}
                variant="outlined"
                className="input"
                type="text"
                name="side"
                placeholder="Amount"
                // onChange={(t) => setRequestAmount(t.target.value)}
              />
              <Button className="button" variant="outlined" color="primary" type="submit" value="Submit">
                Request Tokens
              </Button>
            </label>
          </form>
      </div>
      <div className="lower">
          <form className="form" onSubmit={closeBetting}>
            <label>
              <Button className="button" variant="contained" color="secondary" type="submit" value="Submit">
                Close Betting
              </Button>
            </label>
          </form>
        </div>
      </div>
    </div>
    );
  }

  const ChangeAddress = () => {
    return(
      <div className="main">
        <div className="card">
          <div>
            <form className="form" id="changeAddressForm" autocomplete="off" onSubmit={changeAddress}>
              <label>
                <div>Token: {tokenAddress}</div><div>Contract: {contractAddress}</div>
                <br />
                <TextField
                  inputRef={changeTokenRef}
                  className="input"
                  type="text"
                  name="changeToken"
                  placeholder="Token 0x address"
                />
                <TextField
                  inputRef={changeContractRef}
                  // variant="outlined"
                  className="input"
                  type="text"
                  name="changeContract"
                  placeholder="Contract 0x address"
                />
              </label>
              <div>
                <Button className="button" variant="contained" color="secondary" type="submit" value="Submit">
                  Change Addresses
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  const About = () => {
    return(
      <div className="about">
        <label>
          <h1 className="aboutcardheader">What's this?</h1>
          <p>It's is an open-source 'decentralized, permissioned prediction market protocol' running on the Ethereum blockchain (?).</p>
          <p>Users are able to bet against each other on the outcome of a given event (sports game, election, etc). At</p>
          <p>present, wagers are made with the WC token. And because this token exists on the Ropsten test network, it</p>
          <p>has no value. The specific token used can be changed fairly easily, but this is sort of a test.</p>
          <br />
        </label>
        <label>
          <h2 className="aboutcardheader">A peer-to-peer preditction / betting site</h2>
          <p>First, an event is chosen by an admin (currently only one, but that can change). Once an event is chosen and the</p>
          <p>sides are established, users are able to place a wager on the side they prefer. Depending on the event, betting may</p>
          <p>close before a winner is decided. Both sides must have backers or all wagered funds will be returned (I think?).</p>
          <br />
          </label>
        <label>
          <h2 className="aboutcardheader">Step 1: MetaMask</h2>
          <p>Install the <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"> MetaMask browser extenstion</a>. It is a cryptocurrency wallet which is capable of interacting with Web3</p>
          <p>apps (like this site). When you install, it will provide further set up instructions, and while you should save your</p>
          <p>mnemonic, it won't be too important as long as you're only using the testnet.</p>
        </label>
        <label>
          <h2 className="aboutcardheader">Step 2: Ropsten</h2>
          <p>This app is currently only deployed to the Ropsten test network chain of Ethereum, which means all crypto tokens</p>
          <p>(on the test network) have no value. This can be changed without too much difficulty (I mean to change the site, not what follows).</p>
          <br />
          <p>To connect to the Ropsten test network, open MetaMask and click 'Ethereum Mainnnet' (between the fox icon and your</p>
          <p>account icon) and select 'Ropsten Test Network' from the drop down list.</p>
          <br/>
        </label>
        <label>
          <h2 className="aboutcardheader">Step 3: Acquire WC tokens</h2>
          <br />
          <p>???</p>
          <br />
        </label>
        <label>
          <h2 className="aboutcardheader">Step 4: Wager</h2>
          <p>Once you "know" which side is going to win, you can head over to <a href="https://zzimm.com">zzimm.com</a> and place your wager.</p>
          <p>If you haven't already, you'll be asked to connect MetaMask to zzimm.com, which you should do. The dashboard shows the 'State'</p>
          <p>Each side's respective pot, your own wager, and the total pot. State indicates whether an event is active on the site, 0 meaning no,</p>
          <p>1 being yes. The sides will also appear as 'null' when no event is active (front-end web design is a pain).</p>
          <br />
          <p>To place a wager, go to <a href="https://zzimm.com">zzimm.com</a>, ensure an event is active, select your prefered side, enter an</p>
          <p>amount of WC and click submit!</p>
          <p>Note: if you have yet to place a wager, you must first click 'APPROVE' before you will be able to do so.</p>
          <br/>
        </label>
        <label>
          <h2 className="aboutcardheader">Step 5: Winning (hopefully)</h2>
          <p>When an event finishes, the total pot is split among the users who wagered on the winning side, in according to their proportion of the</p>
          <p>winning side's pot. If your wager makes up 2/3 of the bets for the winning side, you recieve 2/3 of the total pot. If you bet for the</p>
          <p>losing side, you win nothing.</p>
          <br/>
        </label>
        <label>
          <h2 className="aboutcardheader">Blockchain?</h2>
          <p>To see (but not change lol) the Ethereum addresses for both the contract and token, visit <a href="https://zzimm.com/changeaddress">zzimm.com/changeaddress</a>.</p>
          <p>The source code can be found at <a href="https://github.com/ZachZimm/eventwager">https://github.com/ZachZimm/eventwager</a>.</p>
          <br/>
          <label>
            <h2 className="aboutcardheader">Permissioned?</h2>
            <p>It just means that there is a user who has the ability to begin and end events, setting the sides and choosing the winner. This 'governance structure' isn't</p>
            <p>nessecarily permanent, but as of now the wallet <a href="https://ropsten.etherscan.io/address/0xaBc1B66F2787239D6E293C01eC3Aa8186b5FE912">0xaBc1B66F2787239D6E293C01eC3Aa8186b5FE912</a> owns this smart contract.</p>
            <br/>
          </label>
          <label>
            <h2 className="aboutcardheader">More?</h2>
            <p>Probably</p>
            <p>Oh right, you'll need some testnet ETH as well. You can get that on <a href="https://faucet.dimensions.network/">faucet.dimensions.network</a>, or by asking around.</p>
            <br/>
            <br/>
          </label>
        </label>
      </div>
    )
  }

  const AboutMeFr = () => {
    return(
      <div className="about">
        <nav class="navbar">
          <a class="brand" href="#">ZZ</a>
          <ul>
            <li>
              <a href="#">Blog</a>
            </li>
            <li>
              <a href="https://zzimm.com/fr/aboutme">À propos</a>
            </li>
            <li>
              <a href="https://zzimm.com">EventWager</a>
            </li>
            <li>
              <a href="https://github.com/zachzimm">GitHub</a>
            </li>
          </ul>
        </nav>
        
        
        <label>
          <h1 className="aboutcardheader">À propos de moi</h1>
          <p>Bonjour! J'mappelle Zach Zimmermann. Je suis un etudiant a l'Université du Nevada à Reno où j'édudie la philosophie et l'informatique.</p>
          <p>J'adore Plato parce que sa pensée est créative. Il est souvent incompris, mais il y a un attrait pour la connaissaince secrète.</p>
          <p>J'ai des intérêts dans: marchés de toutes sortes, trading algorithmique, science des données, et blockchain. Mon travail indépendant il y a est à <a href="https://www.github.com/ZachZimm/">github.com/zachzimm</a>.</p>
          <p>Mon projet le plus récent (provisoirement appelé EventWager) se trouve sur <a href="https://zzimm.com/">zzimm.com</a> et <a href="https://zzimm.com/about">zzimm.com/about</a>, mais MetaMask est requis pour utiliser l'application.</p>
          <br />
        </label>  
      </div>
    )
  }

  const TourFr = () => {
    return(
      <div className="tourmain">
        <h1 className="tourcardheader">Un tour en Provence</h1>
        <h2 className="tourcardsubheader">Caen</h2>
        <div className="tourframe">
          <div classname="vtourimgframe">
            <img 
              className="tourimg"
              src={caenskyline}
              alt="Caen"
            />
            <div className="htourimgframe">
              <img 
                className="tourimglong"
                src={caenmusee}
                alt="Musee de Provence"
              />
              <img
                className="tourimgshort"
                src={caenchateau}
                alt="Chateau de Caen"
              />
            </div>
          </div>
          <div className="tourtext">
            <h3>Quand vous arrivez à Caen, vous irez à l’hôtel Mercure.</h3>
            <h3>Après, vous faites le transport en commun à Château de Caen voir le Musée de Normandie.</h3>
            <br/>
            <h3>Ensuite, on admire les paysages en Jardin Botanique de Caen et l'église de la Ste-Trinité.</h3>
            <br/>
            <h3>Pour le déjeuner, vous avez À Contre Seus manger tripes à la mode de Caen! Ensuite, vous acheterez un billet de train pour Rouen.</h3>
            <br />
          </div>
        </div>
        <h2 className="tourcardsubheader">Rouen</h2>
        <div className="tourframe">
          <div className="tourtext">
              <h3>Vous arrivez à Rouen-Rive-Droite. Quand vous le departez, vous irez à la cathédrale Notre-Dame par le réseau.</h3>
              <h3>Après, vous pouvez visiter le Musée des Beaux-Arts et le Jardin des Plantes. </h3>
              <br/>
              <h3>Vous goûtez la cuisine locale à Tandem. Vous mangez le mouton et vous bouvez le cider! Vous dormirez à l'Hôtel de Bourgtheroulde.</h3>
              <br/>
              <h3>Ensuite, vous achetez un billet de train pour Le Havre. </h3>
              <br />
            </div>
          <div className="vtournimgframe">
            <div className="htourimgframe">
              <img 
                className="tourimgshort"
                src={rouennotredame}
                alt="Notre Dame de Rouen"
              />
              <img 
                className="tourimglong"
                src={rouensquare}
                alt="Rouen Square"
              />
            </div>
            <img 
                // className="tourimg"
                src={rouenjardin}
                alt="Rouen Jardin"
              />
          </div>
        </div>
        <h2 className="tourcardsubheader">Le Havre</h2>
        <div className="tourframe">
          <div classname="vtourimgframe">
            <img 
              className="tourimg"
              src={lehavreskyline}
              alt="Le Havre"
            />
            <div className="htourimgframe">
              <img 
                className="tourimglonglehavre"
                src={lehavremarina}
                alt="Le Havre Marina"
              />
              <img
                className="tourimgshortlehavre"
                src={lehavremuma}
                alt="Le Havre Musée d’art Moderne"
              />
            </div>
          </div>
          <div className="tourtext">
            <h3>Bienvenue à Le Havre! Les locales le disent la première ville moderne en France.</h3>
            <br/>
            <h3>Vous avez mangé beaucoup de cafés! On admire la ville parce que l’est un site UNESCO.</h3>
            <br/>
            <h3> Vous visitez la marina pittoresque et André Masacx musée d’art moderne.</h3>
            <br/>
            <h3>Ensuite, vous dormirez à l'hôtel local.</h3>
            <br/>
            <h3>Vous parlez de leurs parents et vous leur écrivez une carte postale.</h3>
            <br />
          </div>
        </div>
        <h2 className="tourcardsubheader">Combien d’argent? 1000€ pour les vacances!</h2>
        <br/>
      </div>
    )
    // Bigger text, wider images, maybe I'll download and crop them
  }

  const Sean = () => {
    return(
            <img
              src={sean}
              alt="Sean the Swan"
              width="100%"
              height="100%"
            />
    )
  }

  // var metastring = JSON.stringify(metadata)
  var metastring = JSON.stringify(bayc)

  const Meta = () => {
    return(
            <pre>{metastring}</pre>
    )
  }

  console.log(metadata)

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/admin">
          <Admin />
        </Route>
        <Route exact path="/changeaddress">
          <ChangeAddress />
        </Route>
        <Route exact path="/about">
          <About />
        </Route>
        <Route exact path="/fr/aboutme">
          <AboutMeFr />
        </Route>
        <Route exact path="/fr/tour">
          <TourFr />
        </Route>
        <Route exact path="/sean.jpg">
          <Sean />
        </Route>
        <Route exact path="/meta4.json">
          <Meta />
        </Route>
        <Route path="/meta.json">
          <Meta />
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