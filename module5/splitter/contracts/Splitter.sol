pragma solidity ^0.4.21;
contract Splitter {
    
    address public m_bob;
    address public m_carol;
    mapping(address => uint) public balances;

    event Split(address sender, address receiver1, address receiver2, uint amount);
    event Withdraw(address withdrawer, uint amount);
    
    function Splitter(address bob, address carol) public
    {
        require(bob != 0);
        require(carol != 0);
        m_bob = bob;
        m_carol = carol;
    }
    
    function split() public payable 
    {
        require(msg.value > 0);
            balances[m_bob] = balances[m_bob] + msg.value/2;
            balances[m_carol] = balances[m_carol] + msg.value/2;
            if(msg.value % 2 != 0)
                balances[msg.sender] = balances[msg.sender] +1;
            emit Split(msg.sender,m_bob,m_carol,msg.value); 
    }

    function splitWhoever(address whoeverA, address whoeverB) public payable
    {
        require(whoeverA != 0);
        require(whoeverB != 0);
        require(msg.value > 0);
            balances[whoeverA] = balances[whoeverA] + msg.value/2;
            balances[whoeverB] = balances[whoeverB] + msg.value/2;
            if(msg.value % 2 != 0)
                balances[msg.sender] = balances[msg.sender] +1;
            emit Split(msg.sender,m_bob,m_carol,msg.value); 
    }

    function withdraw() public
    {
        require(balances[msg.sender] > 0);
            msg.sender.transfer(balances[msg.sender]);
            balances[msg.sender] = 0;
            emit Withdraw(msg.sender,balances[msg.sender]);
    }
}

