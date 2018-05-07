
			   pragma solidity ^0.4.19;
contract Splitter {
    
    address public m_bob;
    address public m_carol;
    
    function Splitter(address bob, address carol)
    public
    {
        m_bob = bob;
        m_carol = carol;
    }
    
    function split() 
    public
    payable 
    {
        require(msg.value > 0);
            m_bob.transfer(msg.value/2);
            m_carol.transfer(msg.value/2);
      
    }
    
    function getBobBalance() 
    public
    view
        returns (uint balance)
    {
        return m_bob.balance;
    }
}
