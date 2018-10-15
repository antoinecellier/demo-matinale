pragma solidity ^0.4.17;

contract Betting {
    // un smart contract de pari avec une ihm pour déclencher les évenements
    // function view -> sur tous les matchs pariables avec leurs cotes
    // function view -> sur tous les paris en cours
    // function view -> historique de mes paris 
    // héritage: contract Bet -> SoccerBet
    // mortal.sol & owned.sol -> https://github.com/Apress/introducing-ethereum-solidity
    // créer un smart contract maintenable
    // créer un token liée à l'application ??? voir la difficultée
    // un oracle (différentes sources de données) qui va recupérer les matchs de foot des 7 prochains jours
    
    address public owner;

    Match[] public matchs;
    
    uint public matchIDGenerator = 1;

    struct Match {
        uint id;
        string homeTeam;
        string externalTeam;
        bool homeVictory;
        bool equality;
        string libelle;
        uint256 date; 
        bool settled;
        uint quotation;
    }

    struct Bet {
        address bettor;
        uint amount;
        uint match_id;
        bool homeVictoryBet;
        bool equalityBet;
    }

    mapping(address => Bet[]) addressToBets;
    mapping(uint => Bet[]) betsOnMatch;



    constructor() public payable{
        owner = msg.sender;
    }


    function getMatchsLenght() public view returns(uint) { return matchs.length; }

    event CreateMatch(string _homeTeam, string _externalTeam, string _libelle, uint256 _date, uint _matchIDGenerator, uint _quotation);
    
    modifier onlyowner { if (msg.sender == owner) _; }
     
    function createMatch(string _homeTeam, string _externalTeam, string _libelle, uint256 _date, uint _quotation) external onlyowner {
        matchIDGenerator++;
        emit CreateMatch(_homeTeam, _externalTeam, _libelle, _date, matchIDGenerator, _quotation);
        matchs.push(Match(matchIDGenerator, _homeTeam, _externalTeam, true, true, _libelle, _date, false, _quotation));
        //matchs[matchIDGenerator].id = matchIDGenerator;
        // matchs[matchIDGenerator].homeTeam = _homeTeam;
        // matchs[matchIDGenerator].externalTeam = _externalTeam;
        // matchs[matchIDGenerator].libelle = _libelle;
        // matchs[matchIDGenerator].settled = false;
        // matchs[matchIDGenerator].date = _date;
    }

    event BetOnMatch(address bettor, bool _homeVictory, bool _equality, uint match_id);
    
    function betOnMatch(bool _homeVictory, bool _equality, uint match_id) payable external {
        Bet memory newBet = Bet(msg.sender, msg.value, match_id, _homeVictory, _equality);
        addressToBets[msg.sender].push(newBet);
        betsOnMatch[match_id].push(newBet);
        emit BetOnMatch(msg.sender, _homeVictory, _equality, match_id);
    }

    event ResolvedBet(address bettor, uint gain, uint amount, uint quotation);
    event ResolvedMatch(uint match_id, bool homeVictory, bool equality);

    function resolveMatch(uint _match_id, bool _homeVictory, bool _equality) external onlyowner {
        Match memory currentMatch = matchs[_match_id];
        require(!currentMatch.settled);
        currentMatch.settled = true;
        Bet[] storage betsOnCurrentMatch = betsOnMatch[_match_id];
        for(uint x = 0; x < betsOnCurrentMatch.length; x++ ){
            if((_homeVictory && betsOnCurrentMatch[x].homeVictoryBet) || 
               (_equality && betsOnCurrentMatch[x].equalityBet)){
                uint gain = (betsOnCurrentMatch[x].amount * currentMatch.quotation);
                betsOnCurrentMatch[x].bettor.transfer(gain);
                emit ResolvedBet(
                    betsOnCurrentMatch[x].bettor, 
                    gain, 
                    betsOnCurrentMatch[x].amount, 
                    currentMatch.quotation);
            }
        }    
        emit ResolvedMatch(_match_id, _homeVictory, _equality);
    }   
}