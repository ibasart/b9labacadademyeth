var Remittance = artifacts.require("./Remittance.sol");

contract('Remittance', function(accounts) {

	it("check hash is initialized", function() {
		var instance;
		Remittance.deployed().then(instance_param => {
			instance = instance_param;
			return instance.puzzleHash();
		})
		.then(hash => {
			assert.notEqual(web3.toDecimal(hash), 0);
		});
	});

	it("Check hash and initial funds are initialized", async function() {
		let instance = await Remittance.new("superpassword", 1, {value: 1e+18, from: accounts[0]});

		var hash = await instance.puzzleHash();
		assert.notEqual(web3.toDecimal(hash),0);
		assert.equal(hash, web3.sha3("superpassword"));

		var funds = await instance.fundsToTransfer();
		assert.isAbove(funds, 0);
		var fundsInEther = web3.fromWei(funds, "ether");
		assert.equal(fundsInEther, 1);

		var alice = await instance.Alice();
		assert.notEqual(alice, 0);
		var carol = await instance.Carol();
		assert.equal(carol, 0);
	});

	it("Check cannot create a contract initialized with less than 1 ether", async function() {
		let instance;
		try {
			instance = await Remittance.new("passwordtopass", 1, {value: 1e+10, from: accounts[0]});
		} catch(error) {
		}
		assert.isUndefined(instance);
	});

	it("Check Carol can get funds", async function() {
		let instance = await Remittance.new("passwordtosend", 100, {value: 1e+18, from: accounts[0]});
		var carolInitialBalance = web3.fromWei(web3.eth.getBalance(accounts[1]));
		await instance.transferFunds("passwordtosend", {from: accounts[1]});
		var carol = await instance.Carol();
		var carolFinalBalance = web3.fromWei(web3.eth.getBalance(carol), 'ether');
		var funds = await instance.fundsToTransfer();
		assert.equal(funds, 0);
		assert(carolFinalBalance > carolInitialBalance);
	});

        it("Check cannot create a contract with a timeline greater than 3000 seconds", async function() {
		let instance;
		try {
                	instance = await Remittance.new("superpassword", 3001, {value: 1e+18, from: accounts[0]});
		} catch(error) {}
		assert.isUndefined(instance);
	});

        it("Check cannot transfer funds after deadline", async function() {
		let deadline = 4;
                let instance = await Remittance.new("passwordtosend", deadline, {value: 1e+18, from: accounts[0]});
		var funds = await instance.fundsToTransfer();
                const wait = (ms) => {
                  return new Promise((resolve) => {
                    setTimeout(resolve, ms);
                  });
                }
                await wait((deadline + 1) * 1000);
		try {
			await instance.transferFunds("passwordtosend", {from: accounts[1]});
		}
		catch(error) {}
		var finalFunds = await instance.fundsToTransfer();
		assert.notEqual(finalFunds, funds, "Funds are different");
	});

	it("Check Alice cannot try to transfer funds", async function() {
		let instance = await Remittance.new("passwordtosend", 80, {value: 1e+18, from: accounts[0]});
		var initialFunds = await instance.fundsToTransfer();
		var alice = await instance.Alice();
		try {
			await instance.transferFunds("passwordtosend", {from: alice});
		} catch(error) {}
		var finalFunds = await instance.fundsToTransfer();
		assert(initialFunds != finalFunds);
	});

	it("Check Alice can claim funds after deadline", async function() {
		let instance = await Remittance.new("passwordtosend", 1, {value: 1e+18, from: accounts[0]});
		var aliceInitialFunds = web3.fromWei(web3.eth.getBalance(await instance.Alice()));
		var initialFunds = web3.fromWei(await instance.fundsToTransfer());
		assert.equal(initialFunds, 1);
                const wait = (ms) => {
                  return new Promise((resolve) => {
                    setTimeout(resolve, ms);
                  });
                }
                await wait(2 * 1000);
		var aliceFinalFunds = web3.fromWei(web3.eth.getBalance(await instance.Alice()));
		var alice = await instance.Alice();
		await instance.ownerClaimFunds({from: alice});
		var finalFunds = web3.fromWei(await instance.fundsToTransfer());
		assert.equal(finalFunds, 0);
		var aliceFinalFunds = web3.fromWei(web3.eth.getBalance(await instance.Alice()));
		assert(aliceFinalFunds > aliceInitialFunds);
	});

	it("Check Alice cannot claim funds before deadline", async function() {
                let instance = await Remittance.new("passwordtosend", 4, {value: 1e+18, from: accounts[0]});
                var initialFunds = web3.fromWei(await instance.fundsToTransfer());
                assert.equal(initialFunds, 1);
                const wait = (ms) => {
                  return new Promise((resolve) => {
                    setTimeout(resolve, ms);
                  });
                }
                await wait(2 * 1000);
		try {
	                await instance.ownerClaimFunds({from: alice});
		} catch(error) { }
                var finalFunds = web3.fromWei(await instance.fundsToTransfer());
		assert.equal(initialFunds.toNumber(), finalFunds.toNumber());
	});

        it("Check only Alice can claim funds after deadline", async function() {
                let instance = await Remittance.new("passwordtosend", 1, {value: 1e+18, from: accounts[0]});
                var initialFunds = web3.fromWei(await instance.fundsToTransfer());
                assert.equal(initialFunds, 1);
                const wait = (ms) => {
                  return new Promise((resolve) => {
                    setTimeout(resolve, ms);
                  });
                }
                await wait(2 * 1000);
                try {
                        await instance.ownerClaimFunds({from: accounts[1]});
                } catch(error) { }
                var finalFunds = web3.fromWei(await instance.fundsToTransfer());
                assert.equal(initialFunds.toNumber(), finalFunds.toNumber());
        });});



