pragma solidity ^0.4.21;

contract Remittance {
    address public Alice;
    address public Carol;
    bytes32 public puzzleHash;
    uint public fundsToTransfer;
    uint public end;

    event LogFundsTransferred(address sender, address recipient, uint amount);
    event LogOwnerClaimedFunds(address sender, uint amount);

    function Remittance(string puzzle, uint durationinseconds) public payable {
    	require(msg.value >= 1 ether);
    	require(durationinseconds > 0);
    	require(durationinseconds <= 3000);
	Alice = msg.sender;
        puzzleHash = keccak256(puzzle);
	fundsToTransfer = msg.value;
	end = now + durationinseconds * 1 seconds;
    }

    function isDeadlineReached() private view returns (bool) {
	if (end >= now * 1 seconds) {
		return false;
	}
	else {
		return true;
	}
    }

    function transferFunds(string password) public {
		require(msg.sender != Alice);
		require(isDeadlineReached() == false);
		require(keccak256(password) == puzzleHash);
		require(fundsToTransfer > 0);
	Carol = msg.sender;	
	uint amountToTransfer = fundsToTransfer;
	fundsToTransfer = 0;
	Carol.transfer(amountToTransfer);
	emit LogFundsTransferred(Alice, Carol, amountToTransfer);
    }

    function ownerClaimFunds() public {
        require(msg.sender == Alice);
        require(isDeadlineReached() == true);
        require(fundsToTransfer > 0);
    uint amountToTransfer = fundsToTransfer;
    fundsToTransfer = 0;
    Alice.transfer(amountToTransfer);
    emit LogOwnerClaimedFunds(Alice, amountToTransfer);   
    }
}

