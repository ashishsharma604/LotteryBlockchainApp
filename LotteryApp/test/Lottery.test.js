const assert = require('assert');
const ganache = require('ganache-cli');

const Web3 = require('web3')

const web3 = new Web3(ganache.provider());


const {interface, bytecode} = require('../compile')

let lottery;
let accounts;

beforeEach(async () => {

  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(JSON.parse(interface))
            .deploy({data: bytecode})
            .send({from: accounts[0], gas: '1000000'})
});

describe('lottery contract ',  () => {

  it('deploys a contract', () => {

    assert.ok(lottery.options.address);
  });

  it('allow main account to enter',async () => {

    await lottery.methods.enter().send({

      from:accounts[0],
      value: web3.utils.toWei('0.1', 'ether')
    });

    const players = await lottery.methods.getPlayers().call({

      from: accounts[0]
    });

    assert.equal(accounts[0], players[0]);
    assert.equal(1, players.length)
  });

  it('allow multiple account to enter',async () => {

    await lottery.methods.enter().send({

      from:accounts[1],
      value: web3.utils.toWei('0.1', 'ether')
    });

    await lottery.methods.enter().send({
    from:accounts[2],
    value: web3.utils.toWei('0.1', 'ether')
    });

    const players = await lottery.methods.getPlayers().call({

      from: accounts[0]
    });

  //  assert.equal(accounts[0], players[0]);
    // assert.equal(accounts[1], players[1]);
    // assert.equal(accounts[2], players[2]);
    console.log('all the players' + players);
    assert.equal(2, players.length);
  });

  it('requires a minimum amount of ether to enter', async () => {

    try {

      await lotter.methods.enter().send({

        from: accounts[0],
        value: 0
      });
      assert(false);
    }
      catch(err) {

        assert(err);
      }
  });

  it('only manager can call pickWinner', async () => {

    try {

      await lottery.methods.pickWinner().send({
        from: accounts[1]
      });

      assert(false);
    }
    catch(err) {

      assert(err);
    }
  });

  it('pick a winner and reset the players array', async () => {

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('2','ether')
    });

    const initialBalance = await web3.eth.getBalance(accounts[0]);

    await lottery.methods.pickWinner().send({from: accounts[0]});

    const finalBalance = await web3.eth.getBalance(accounts[0]);

    const difference = finalBalance - initialBalance;

    assert(difference > web3.utils.toWei('1.8','ether'));
  })
});
