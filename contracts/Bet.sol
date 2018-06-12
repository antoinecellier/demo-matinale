pragma solidity ^0.4.17;

contract Bet {
    // un smart contract de pari avec une ihm pour déclencher les évenements
    // function view -> sur tous les matchs pariables avec leurs cotes
    // function view -> sur tous les paris en cours
    // function view -> historique de mes paris 
    // héritage: contract Bet -> SoccerBet
    // mortal.sol & owned.sol -> https://github.com/Apress/introducing-ethereum-solidity
    // créer un smart contract maintenable
    // créer un token liée à l'application ??? voir la difficultée
    // un oracle (différentes sources de données) qui va recupérer les matchs de foot des 7 prochains jours
    
   

    mapping(string => Match) idToMatch;

    struct Match {
        string id;
        string homeTeam;
        string externalTeam;
        bool victory;
        bool equality;
        string team;
        uint256 date; 
    }

    struct Betting {
        address bettor;
        uint amount;
        uint quotation;
        bool victory;
        bool equality;
        string match_id;
        string team;
    }

    mapping(address => Betting) addressToBet;

    event ResolvedBet(address bettor, uint gain, uint amount, uint quotation);

    mapping(address => Betting[]) addressToHistory;


    constructor() public payable{}

    function bet(uint _quotation, bool _victory, bool _defeat, bool _equality, string match_id, string _team) payable external {
        addressToBet[msg.sender] = 
            Betting(msg.sender, msg.value, _quotation, _victory, _defeat, _equality, match_id, _team);
        

        addressToHistory[msg.sender].push(addressToBet[msg.sender]);
    }

    function resolveBet() external {
        Betting memory currentBet = addressToBet[msg.sender];
        Match memory matchBet = idToMatch[currentBet.match_id];
        string resultMatch = matchBet.victory ? matchBet.team : 'test';
        require(msg.sender == currentBet.bettor);
        uint gain = (currentBet.amount * currentBet.quotation);
        msg.sender.transfer(gain);
        emit ResolvedBet(msg.sender, gain, currentBet.amount, currentBet.quotation);
    }
}