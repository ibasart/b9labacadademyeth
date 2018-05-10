var Splitter = artifacts.require("./Splitter.sol");


contract('Splitter', function(accounts) {

		it("check values are properly initialized", async function() {
					let instance = await Splitter.new(accounts[1],accounts[2]);
					var bobBalanceToTransfer = await instance.balances.call(accounts[1]);
					var carolBalanceToTransfer = await instance.balances.call(accounts[2]);
					assert.equal(0,bobBalanceToTransfer);
					assert.equal(0,carolBalanceToTransfer);
					console.log("Bob balance to transfer: " + bobBalanceToTransfer);
					console.log("Carol balance to transfer: " +  carolBalanceToTransfer);
					})

		it("check split is working", async function() {
								let instance = await Splitter.new(accounts[1],accounts[2]);
								await instance.split({value: 100})
								var bobBalanceToTransfer = await instance.balances.call(accounts[1]);
			                                        var carolBalanceToTransfer = await instance.balances.call(accounts[2]);
								assert.equal(50,bobBalanceToTransfer);
								assert.equal(50,carolBalanceToTransfer);
								console.log("Bob balance to transfer: " + bobBalanceToTransfer);
								console.log("Carol balance to transfer: " +  carolBalanceToTransfer);
								})
		
		it("check withdraw is working", async function() {
								let instance = await Splitter.new(accounts[1],accounts[2]);
								var bobBalance = web3.eth.getBalance(accounts[1]);
								console.log("Bob initial balance:" + bobBalance);
								await instance.split({value: 1e+18});
								await instance.withdraw({from: accounts[1]});
								var bobNewBalance = web3.eth.getBalance(accounts[1]);
								console.log("Bob final balance:" + bobNewBalance);
								assert.isTrue(bobBalance.toNumber() < bobNewBalance.toNumber());
								})

		it("assert split amount cannot be zero", async function() {
								let instance = await Splitter.new(accounts[1],accounts[2]);
								try {
									await instance.split({value: 0});
								} catch(error) {
									console.log("Error: " + error);
									assert.include(error.message,"revert");
								}
								})

		it("assert adress cannot be zero", async function() {
							        var errorThrown = false;	
								try {
									let instance = await Splitter.new(0,accounts[2]);									        					    } catch(error) {
									console.log("Error: " + error);
									errorThrown = true;
									}
								assert(errorThrown,"Error should have been thrown");
							})
		it("assert split  david and Jon even value", async function() {
								let instance = await Splitter.new(accounts[1],accounts[2]);
								await instance.splitWhoever(accounts[3],accounts[4],{value: 101});
								var davidBalanceToTransfer = await instance.balances.call(accounts[3]);
								var jonBalanceToTransfer = await instance.balances.call(accounts[4]);
								var senderBalanceToTransfer = await instance.balances.call(accounts[0]);
								assert.equal(50,davidBalanceToTransfer);
								assert.equal(50,jonBalanceToTransfer);
								assert.equal(1,senderBalanceToTransfer);
								console.log("David balance to transfer: " + davidBalanceToTransfer);
								console.log("Jon balance to transfer: " +  jonBalanceToTransfer);
								console.log("Sender balance to transfer: " +  senderBalanceToTransfer);
																			})

		});


