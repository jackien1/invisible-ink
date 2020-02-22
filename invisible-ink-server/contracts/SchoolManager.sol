pragma solidity ^0.5.0;
import "./Ownership.sol";
import "./School.sol";

contract SchoolManager is Ownership {
    address[] public deployedSchools;

    function createSchool(string memory _name) public {
        address newSchool = address(new School(_name, msg.sender));
        deployedSchools.push(newSchool);
    }

    function returnSchools() public view returns(address[] memory) {
        return deployedSchools;
    }
}
