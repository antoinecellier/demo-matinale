var Betting = artifacts.require("Betting");

contract('Betting', function(accounts) {
  it("should persist a match when the createMatch function is called", function() {
    let betting;
    let mainAccount = accounts[0];

    return Betting.deployed().then(function(instance) {
      betting = instance;
      return betting.createMatch("homeTeam", "challengerTeam", "libelle", 10, 100, {
      gas: 1000000,
      from: mainAccount});
    }).then(function() {
      return betting.matchs.call(0);
    }).then(function(match) {  
      assert.equal(match[0].toNumber(), 1, "l'id du match est incorrect"); 
      assert.equal(match[1], "homeTeam", "La home team n'est pas correcte");
      assert.equal(match[2], "challengerTeam", "La home des challengers n'est pas correcte");
      assert.equal(match[3], true, "Le match ne doit pas être terminé - victoire homeTeam");
      assert.equal(match[4], true, "Le match ne doit pas être terminé - égalité");
      assert.equal(match[5], "libelle", "Le libelle du match n'est pas correct.");
      assert.equal(match[6].toNumber(), 10, "La date n'est pas correcte");
      assert.equal(match[7], false, "Le match ne doit pas être terminé"); 
      assert.equal(match[8].toNumber(), 100, "La cote n'est pas correcte");
    });
  });

   it("should persist a bet when the bet function is called", function() {
    let betting;
    let mainAccount = accounts[0];
    return Betting.deployed().then(function(instance) {
      betting = instance;
      return betting.createMatch("homeTeam", "challengerTeam", "libelle", 10, 100, {
      gas: 1000000,
      from: mainAccount});
    }).then(function() {
      return betting.betOnMatch(
      true, false, 1, {
        gas: 300000,
        from: mainAccount,
        value: 500000000
      });
    }).then(function() {  
     return betting.getUserBets(mainAccount);
    }).then(function(bets) {
      assert.equal(bets[0][0].toNumber(), 500000000, "Le montant du pari est incorrect"); 
      assert.equal(bets[1][0].toNumber(), 1, "L'id du match est incorrect");
      assert.equal(bets[2][0], true, "Le pari doit être sur la home team");
      assert.equal(bets[3][0], false, "Le pari ne doit pas être sur une égalité");
    });
  });

  it("should finish the match and solve the bets when the resolveMatch function is called", function() {
    let betting;
    let mainAccount = accounts[0];
    let initialMainAccountBalance;
    let initialOtherAccountBalance;
    return Betting.deployed().then(function(instance) {
      betting = instance;
      return betting.createMatch("homeTeam", "challengerTeam", "libelle", 10, 200, {
      gas: 1000000,
      from: mainAccount});
    })
    .then(function() {
      return betting.createMatch("homeTeam", "challengerTeam", "libelle", 10, 200, {
      gas: 1000000,
      from: mainAccount});
    }).then(function() {
      return betting.betOnMatch(
      true, false, 1, {
        gas: 300000,
        from: mainAccount,
        value: 500000000
      });
    }).then(function() {
      return betting.betOnMatch(
      false, false, 1, {
        gas: 300000,
        from: accounts[1],
        value: 6000000000
      });
    }).then(function() {
          return web3.eth.getBalance(accounts[0]);
    }).then(function(balance) {
      initialMainAccountBalance = balance.toNumber();
      return web3.eth.getBalance(accounts[1]);
    }).then(function(balance) {
      initialOtherAccountBalance  = balance.toNumber();  
      return betting.resolveMatch(
      1, false, false,{
      gas: 300000,
      from: mainAccount
    });
    }).then(function() {  
     return betting.matchs.call(0);
    }).then(function(match) {
      assert.equal(match[3], false, "Le match doit être terminé sur victoire challenger - victoire homeTeam");
      assert.equal(match[4], false, "Le match doit être terminé sur victoire challenger- égalité");
      assert.equal(match[7], true, "Le match doit être terminé");
      return web3.eth.getBalance(accounts[0]);
    }).then(function(balance) {
      assert.equal(balance.toNumber()<initialMainAccountBalance, true , "Le premier parieur a perdu son pari");
      return web3.eth.getBalance(accounts[1]);
    })
    .then(function(balance) {
       assert.equal(balance.toNumber() - initialOtherAccountBalance, 6000000000 , "Le deuxième joueur a gagné son pari");
      assert.equal(balance.toNumber(), initialOtherAccountBalance + 6000000000, "Le deuxième joueur a gagné son pari");
    });
  });
});