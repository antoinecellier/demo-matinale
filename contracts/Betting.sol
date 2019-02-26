pragma solidity 0.5.0;
pragma experimental ABIEncoderV2;

contract Betting{
    // héritage: contract Bet -> SoccerBet
    // mortal.sol & owned.sol -> https://github.com/Apress/introducing-ethereum-solidity
    // créer un smart contract maintenable
    // créer un token liée à l'application ??? voir la difficultée
    // un oracle (différentes sources de données) qui va recupérer les matchs de foot des 7 prochains jours
    
    address public owner;

    Match[] public matchs;
    
    uint public matchIDGenerator = 0;

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
        address payable bettor;
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
 
    // event LogBet(uint _amount, uint _match_id, string _result, string _homeTeam, string _externalTeam);

    function getMatchIdsByBetter(address better)
        public view returns(uint[] memory) {
        uint[] memory match_ids = new uint[](addressToBets[better].length);
        for (uint i = 0; i < addressToBets[better].length; i++) {
            Bet storage bet = addressToBets[better][i];
            match_ids[i] = bet.match_id;
        }
        return (match_ids);
    }

    function getUserBets(address better) 
        public view returns(uint[] memory, uint[] memory, bool[] memory, bool[] memory) {
        uint[] memory amounts = new uint[](addressToBets[better].length);
        uint[] memory match_ids = new uint[](addressToBets[better].length);
        bool[] memory homeVictoryBets = new bool[](addressToBets[better].length);
        bool[] memory equalityBets = new bool[](addressToBets[better].length);
        
        for (uint i = 0; i < addressToBets[better].length; i++) {
            Bet storage bet =  addressToBets[better][i];
            amounts[i] = bet.amount;
            match_ids[i] = bet.match_id;
            homeVictoryBets[i] = bet.homeVictoryBet;
            equalityBets[i] = bet.equalityBet;
        }
        
        return (amounts, match_ids, homeVictoryBets, equalityBets);  
    }

    function getMatchsLenght() public view returns(uint) { return matchs.length; }

    event CreateMatch(string _homeTeam, string _externalTeam, string _libelle, uint256 _date, uint _matchIDGenerator, uint _quotation);
    
    modifier onlyowner { if (msg.sender == owner) _; }
     
    function createMatch(string calldata _homeTeam, string calldata _externalTeam, string calldata _libelle, uint256 _date, uint _quotation) external onlyowner {
        matchIDGenerator++;
        emit CreateMatch(_homeTeam, _externalTeam, _libelle, _date, matchIDGenerator, _quotation);
        matchs.push(Match(matchIDGenerator, _homeTeam, _externalTeam, true, true, _libelle, _date, false, _quotation));
    }

    event BetOnMatch(address bettor, bool _homeVictory, bool _equality, uint match_id, uint amount);
    
    function betOnMatch(bool _homeVictory, bool _equality, uint match_id) payable external {
        Bet memory newBet = Bet(msg.sender, msg.value, match_id, _homeVictory, _equality);
        addressToBets[msg.sender].push(newBet);
        betsOnMatch[match_id].push(newBet);
        emit BetOnMatch(msg.sender, _homeVictory, _equality, match_id, msg.value);
    }

    event ResolvedBet(address bettor, uint gain, uint amount, uint quotation);
    event ResolvedMatch(uint match_id, bool homeVictory, bool equality);
    event debugResolvedMatch(uint match_id, bool homeVictory, bool equality, bool settled);
    event BetTreatment(address bettor, uint amount, bool homeVictory, bool equality);
    function resolveMatch(uint _match_id, bool _homeVictory, bool _equality) external onlyowner {
        emit ResolvedMatch(_match_id, _homeVictory, _equality);
        Match storage currentMatch = matchs[_match_id-1];
        
        emit debugResolvedMatch(_match_id, _homeVictory, _equality, currentMatch.settled);
        require(!currentMatch.settled);
        currentMatch.settled = true;
        currentMatch.homeVictory = _homeVictory;
        currentMatch.equality = _equality;
        Bet[] storage betsOnCurrentMatch = betsOnMatch[_match_id];
        for(uint x = 0; x < betsOnCurrentMatch.length; x++ ){
            emit BetTreatment(betsOnCurrentMatch[x].bettor, betsOnCurrentMatch[x].amount, betsOnCurrentMatch[x].homeVictoryBet, betsOnCurrentMatch[x].equalityBet );
            if((_homeVictory && betsOnCurrentMatch[x].homeVictoryBet) || 
               (_equality && betsOnCurrentMatch[x].equalityBet) ||
                (!_homeVictory && !_equality && !betsOnCurrentMatch[x].homeVictoryBet && !betsOnCurrentMatch[x].equalityBet)){
                uint gain = (betsOnCurrentMatch[x].amount * currentMatch.quotation)/100;
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