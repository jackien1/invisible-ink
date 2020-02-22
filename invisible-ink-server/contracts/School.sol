pragma solidity ^0.5.0;
import "./Ink.sol";

contract School {
    address[] deployedInks;
    string name;
    address administrator;

    constructor(string memory _name, address _administrator) public {
        name = _name;
        administrator = _administrator;
    }

    function createInk(string memory _title, string memory _description) public {
        address newInk = address(new Ink(_title, _description, msg.sender));
        deployedInks.push(newInk);
    }

    function getDetails() public view returns(string memory, address) {
        return (name, administrator);
    }

    function returnInks() public view returns(address[] memory) {
        return deployedInks;
    }
}
