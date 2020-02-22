pragma solidity ^0.5.0;

contract Ink {
    string title;
    string description;
    address owner;

    struct Message {
        address owner;
        string text;
        uint date;
    }

    Message[] messages;

    constructor(string memory _title, string memory _description, address _owner) public {
        title = _title;
        description = _description;
        owner = _owner;
    }

    function getDetails() public view returns(string memory, string memory, uint, address) {
        return (title, description, messages.length, owner);
    }

    function sendMessage(string memory _newMessage) public {
        Message memory message = Message({owner: msg.sender, text: _newMessage, date: now});
        messages.push(message);
    }

    function getMessage(uint _id) public view returns (address, string memory, uint) {
        return (messages[_id].owner, messages[_id].text, messages[_id].date);
    }
}
