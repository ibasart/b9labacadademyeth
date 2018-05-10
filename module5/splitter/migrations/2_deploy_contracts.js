var ConvertLib = artifacts.require("./ConvertLib.sol");
var Splitter = artifacts.require("./Splitter.sol");

module.exports = function(deployer, network, accounts) {
	const bob = accounts[1];
	const carol = accounts[2];
	  deployer.deploy(Splitter,bob, carol);
};
