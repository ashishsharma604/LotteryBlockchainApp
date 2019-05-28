pragma solidity ^0.4.17;


contract Lottery {

   address public manager;
   address[] public players;

   function Lottery() public {
       manager = msg.sender;

   }

   function enter() public payable{

       //require is global function and used to validation
       require(msg.value > .01 ether) ;

       players.push(msg.sender);
   }


  function randomNumber() private returns(uint) {

  uint random_number = uint(keccak256(block.difficulty,now,players));

  return random_number;
  }

  function pickWinner() public restricted {

      uint winner = randomNumber() % players.length;
      //players[winner] is the address
      //this.balance means all the money the current contract instance have
      players[winner].transfer(this.balance);
      //after picking up a winner, we will clean the array of players for new lottery contest
      players = new address[](0);

  }

  modifier restricted() {

     require(msg.sender == manager);
     _;
  }

  function getPlayers() public view returns(address[]) {

      return players;
  }
}
