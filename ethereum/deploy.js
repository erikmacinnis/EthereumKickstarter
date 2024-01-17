// npm install @truffle/hdwallet-provider
const HDWalletProvider = require('@truffle/hdwallet-provider');
const provider = new HDWalletProvider(
    //mnemonic phrase from dev wallet
    'exercise uncover canal feel post merry ski stairs awake giggle mixture engage',
    // infura project node 
    //Infura api link
)
const Web3 = require('web3');
const web3 = new Web3(provider);
const {abi, bytecode} = require('../artifacts/contracts/Kickstart.sol/CampaignFactory.json');

const deploy = async () => {

    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy contract from account ', accounts[0]);

    const factory = await new web3.eth.Contract(abi)
        .deploy({ data: bytecode})
        .send({ from: accounts[0], gas: '10000000'})
    
    console.log('Factory contract deployed at address ', factory.options.address);
}
deploy();