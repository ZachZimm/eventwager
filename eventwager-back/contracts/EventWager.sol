pragma solidity ^0.8.0;
// pragma experimental ABIEncoderV2;
import "./Token.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
// import "./LinkedList.sol"

contract EventWager is AccessControl
{
    using SafeMath for uint256;
    enum States {
        BettingClosed, BettingOpen
    }

    bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");

    States public state;
    Token private token;
    uint256 public currentPot;
    uint256 public potFor;
    uint256 public potAgainst;
    address public owner;
    string sides;

    struct UserInfo
    {   
        address userAddress;
        uint256 currentWager;
        uint256 totalWinnings;
        uint256 totalLosses;
        uint256 pendingWinnings;
        uint256 side;
        bool isDeposited;
    }

    event Wager(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event RoundStart();
    event BettingClosed();
    event RoundEnd(uint256 winningSide, uint256 amount);
    event TokensRequested(address indexed user, uint256 amount);
    event PassOwnership(address indexed user);
    
    mapping(address => UserInfo) private userInfo;
    UserInfo[] public usersFor;
    UserInfo[] public usersAgainst;
    

    constructor(Token _token) 
    {
        owner = msg.sender;
        token = _token;
        state = States.BettingClosed;
        sides = 'null||&&||null';
        _setupRole(OWNER_ROLE, owner);
    }
    modifier onlyOwner(){
        require(hasRole(OWNER_ROLE, msg.sender), "This function is owner-only.");
        _;
    }
    modifier onlyState(States expected) {
        require(state == expected, "Not permitted while contract is in a no-betting state");
        _;
    }
    function requestTokens(address payee, uint256 _amount) public onlyOwner{
        token.mint(payee, _amount);
        emit TokensRequested(payee, _amount);
    }
    function beginRound(string memory side1, string memory side2) public onlyOwner onlyState(States.BettingClosed) {
        state = States.BettingOpen;
        
        sides = string(abi.encodePacked(side1, "||&&||", side2));
        emit RoundStart();
    }

    function getPot() public view returns (uint256) {
        return currentPot;
    }

    function getPotFor() public view returns (uint256) {
        return potFor;
    }

    function getPotAgainst() public view returns (uint256) {
        return potAgainst;
    }
    
    function wager(uint256 side, uint256 _amount) public payable onlyState(States.BettingOpen) { // Side:0 Not Entered, 1:For, 2:Against
        require(side != 0, "Not a valid side to wager on");
        uint256 allowance = token.allowance(msg.sender, address(this));
        require(allowance >= _amount, "Check the token allowance");
        require(_amount != 0, "Cannot wager 0");
        UserInfo storage user = userInfo[msg.sender];
        require(user.isDeposited == false, "Only 1 wager is allowed per event per user");
        if(user.userAddress == address(0)) { user.userAddress = msg.sender; }
        user.side = side;
        user.currentWager = user.currentWager + _amount;
        if(side == 1) { 
            if(user.isDeposited == false) { usersFor.push(user);}
            potFor = potFor + _amount; 
        }
        else if(side == 2) { 
            if(user.isDeposited == false ) { usersAgainst.push(user); }
            potAgainst = potAgainst + _amount;
        }
        user.isDeposited = true;


        currentPot = currentPot + _amount;
        bool transferSuccess = token.transferFrom(msg.sender, address(this), _amount);
        require(transferSuccess == true, "Token transfer failed :(");

        emit Wager(msg.sender, _amount);
    }

    function endRound(uint256 winningSide) public onlyOwner { // Side:0 Draw, 1:For 2:Against
    state = States.BettingClosed;
        if(winningSide == 1){ // Handle the case when 'for' wins
            for(uint i = usersFor.length; i > 0; i--){ // Handle the Winners
                UserInfo storage user = usersFor[i-1];
                uint256 amnt = calcReward(user.currentWager, potFor, currentPot); // reward = (deposited / winningSideTotal) * totalPot
                bool transferSuccess = token.transfer(user.userAddress, amnt);

                resetUserData(user.userAddress, amnt);
                usersFor.pop(); // Reset the array
            }
            for(uint i = usersAgainst.length; i > 0; i--) { // Handle the losers
                UserInfo storage user = usersAgainst[i-1];
                resetUserData(user.userAddress, 0);
                usersAgainst.pop();
            }
        }
        else if(winningSide == 2) // Handle the case when 'against' wins
        {
            for(uint i = usersAgainst.length; i > 0; i--){
                UserInfo storage user = usersAgainst[i-1];
                uint256 amnt = calcReward(user.currentWager, potAgainst, currentPot); // reward = (deposited / winningSideTotal) * totalPot
                bool transferSuccess = token.transfer(user.userAddress, amnt);

                resetUserData(user.userAddress, amnt);
                usersAgainst.pop();
            }
            for(uint i = usersFor.length; i > 0; i--) {
                UserInfo storage user = usersFor[i-1];
                resetUserData(user.userAddress, 0);
                usersFor.pop();
            }
        }
        else if(winningSide == 0) { // Handle a draw
            for(uint i = usersFor.length; i > 0; i--) {
                UserInfo storage user = usersFor[i-1];
                bool transferSuccess = token.transfer(user.userAddress, user.currentWager); // Return deposited funds
                resetUserData(user.userAddress, 0);
                usersFor.pop();
            }
            for(uint i = usersAgainst.length; i > 0; i--) {
                UserInfo storage user = usersAgainst[i-1];
                bool transferSuccess = token.transfer(user.userAddress, user.currentWager);
                resetUserData(user.userAddress, 0);
                usersAgainst.pop();
            }
        }
        
        potFor = 0;
        potAgainst = 0;
        sides = 'null||&&||null';
        

        emit RoundEnd(winningSide, currentPot);
        currentPot = 0;
    }

    function resetUserData(address _address, uint256 _amount) internal {
        UserInfo storage user = userInfo[_address];
        user.totalWinnings = user.totalWinnings + _amount;
        user.isDeposited = false;
        user.side = 0;
        user.currentWager = 0;
    }

    function getWager(address _address) public view returns (uint256)
    {
        UserInfo storage user = userInfo[_address];
        return user.currentWager;
    }
    function getTotalWinnings(address _address) public view returns (uint256) {
        UserInfo storage user = userInfo[_address];
        return user.totalWinnings;
    }

    function closeBetting() public onlyOwner onlyState(States.BettingOpen) {
        state = States.BettingClosed;
    }

    function isDeposited(address _address) public view returns (bool) {
        UserInfo storage user = userInfo[_address];
        return user.isDeposited;
    }

    function calcReward(uint256 _currentWager, uint256 _sidePot, uint256 _totalPot) public view returns (uint256){
        return (_currentWager.mul(_totalPot)).div(_sidePot);
    }

    function getUserSide(address _address) public view returns (uint256){
        UserInfo storage user = userInfo[_address];
        return user.side;
    }

    function getSides() public view returns (string memory) {
        return sides;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function passOwnership(address _address) public onlyOwner {
        owner = _address;
        emit PassOwnership(_address);
    }

    function getFor() public view returns (uint256){     
        return usersFor.length;
    }
    function getAgainst() public view returns (uint256){
        return usersAgainst.length;
    }

    function getState() public view returns (States) {
        return state;
    }
}