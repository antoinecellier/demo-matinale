pragma solidity 0.5.0;

contract MyToken { 
    /* Public variables of the token */
    string public name;
    string public symbol;
    uint8 public decimals;
    address owner;
    /* This creates an array with all balances */
    mapping (address => uint256) public balanceOf;
    
    /* This generates a public event on the blockchain that will notify clients */
    event Transfer(address indexed from, address indexed to, uint256 value);
    
    /* Initializes contract with initial supply tokens to the creator of the contract */
    constructor(uint256 _supply, string memory _name, string memory _symbol, uint8 _decimals) public {
        /* if supply not given then generate 1 million of the smallest unit of the token */
        if (_supply == 0) _supply = 1000000;
        
        /* Unless you add other functions these variables will never change */
        balanceOf[msg.sender] = _supply;
        name = _name;     
        symbol = _symbol;
        owner = msg.sender;
        /* If you want a divisible token then add the amount of decimals the base unit has  */
        decimals = _decimals;
    }

    /* Send coins */
    function transfer(address _to, uint256 _value) public{
        /* if the sender doenst have enough balance then stop */
        require(balanceOf[msg.sender] < _value);
        require(balanceOf[_to] + _value < balanceOf[_to]);
        
        /* Add and subtract new balances */
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        
        /* Notifiy anyone listening that this transfer took place */
        emit Transfer(msg.sender, _to, _value);
    }

    function credit(uint256 _value) payable public{
        require(balanceOf[owner] >= _value);
        balanceOf[owner] -= _value;
        balanceOf[msg.sender] += _value;
    }

   
}            
