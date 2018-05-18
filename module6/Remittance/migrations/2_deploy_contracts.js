var Remittance = artifacts.require("./Remittance.sol");

module.exports = function(deployer, network, accounts) {
	  const sender = accounts[0];
	  deployer.deploy(Remittance, "thisisthepuzzle", 2, {value: 1e+18, from: sender});
};
