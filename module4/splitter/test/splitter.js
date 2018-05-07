var Splitter = artifacts.require("./Splitter.sol");

contract('Splitter', function(accounts) {

	it("check bob and carol is 0", function() {
		let splitterInstance;
		var bobInitialBalance;
		var bobAccount;
		var carolInitialBalance;
		var carolAccount;
		var amount = 10000;

		Splitter.deployed().then(instance => {
			splitterInstance = instance;
			return splitterInstance.m_bob();
		})
		.then(bob => {
			bobAccount = bob;
			bobInitialBalance = web3.eth.getBalance(bob);
			console.log('Main account balance: ' + web3.eth.getBalance(accounts[0]));
		        console.log('Bob Address: ' + bob);	
			console.log('Amount to transfer: ' + amount);
			console.log('Bob initial balance: ' + bobInitialBalance.toNumber());
			return splitterInstance.m_carol();
		})
		.then(carol => {
			carolAccount = carol;
			carolInitialBalance = web3.eth.getBalance(carol);
			console.log('Carol initial balance: ' + carolInitialBalance.toNumber());
			return splitterInstance.split( { from: accounts[0] , value: amount } );
		})
		.then(() => {
			console.log('Bob final balance: ' + web3.eth.getBalance(bobAccount));
			console.log('Carol final balance: ' + web3.eth.getBalance(carolAccount));
			var bobFinalBalance = web3.eth.getBalance(bobAccount);
			assert.equal(bobInitialBalance.toNumber() + (amount / 2), bobFinalBalance.toNumber(), 'Bob final balance is not initial balance plus (amount /2)' );
			var carolFinalBalance = web3.eth.getBalance(carolAccount);
			assert.equal(carolInitialBalance.toNumber() + (amount / 2), carolFinalBalance.toNumber(), 'Carol final balance is not initial plus amount / 2');
		});
	});
});


