const Web3 = require('web3');
const web3 = new Web3('HTTP://127.0.0.1:7545');
const assert = require('assert')
const compiledCampaign = require('../artifacts/contracts/Kickstart.sol/Campaign.json');
const compiledFactory = require('../artifacts/contracts/Kickstart.sol/CampaignFactory.json');

let accounts, campaign, factory, campaignAddress;

beforeEach( '', async () => {
    accounts = await web3.eth.getAccounts()

    factory = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: compiledFactory.bytecode})
        .send({ from: accounts[0], gas: '10000000'});

    await factory.methods.createCampaign('0x170e6aEfC106fcdE84C11fE3C2746aaA9055AD68', '100000000000000000')
        .send({ from: accounts[0], gas: '10000000'});

    const addresses = await factory.methods.getDeployedCampaigns().call({ from: accounts[0]});
    campaignAddress = addresses[0];

    // Create contract object for contract that has already been deployed
    campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
})

describe('Test campaign contract', () => {
    it('Test initiated variables', async () => {
        const manager = await campaign.methods.manager().call({from: accounts[0]})
        const minContribution = await campaign.methods.minimumContribution().call({ from: accounts[0] })
        assert.equal(manager, '0x170e6aEfC106fcdE84C11fE3C2746aaA9055AD68');
        assert.equal(minContribution, '100000000000000000');
    })
    it('it deployed properly', async () => {
        const factoryAddress = factory.options.address;
        assert.ok(factoryAddress)
        const campaignAddress = campaign.options.address;
        assert.ok(campaignAddress);
    })
    it('can contribute and become approver', async () => {
        await campaign.methods.contribute().send({ from: accounts[1], value: '200000000000000000'});
        const isApprover = await campaign.methods.approvers(accounts[1]).call({ from: accounts[1]});
        assert(isApprover);
    })
    it('can contribute and not become approver', async () => {
        await campaign.methods.contribute().send({ from: accounts[2], value: '200000000000000'});
        try {
            const isApprover = await campaign.methods.approvers(accounts[2]).call({ from: accounts[2]});
            assert(false);
        } catch(err) {
            assert(err);
        }
    })
    it('manager can create request', async () => {
        await campaign.methods.createRequest('Buy batteries', '100', accounts[1]).send({from: accounts[0], gas: 100000000})
        const request = await campaign.methods.requests(0).call();
        assert.equal('Buy batteries', request.name);
    })
    it('processes request', async () => {
        let initialBalance = await web3.eth.getBalance(accounts[1]);

        await campaign.methods.contribute().send({ from: accounts[0], value: web3.utils.toWei('10', 'ether')});

        await campaign.methods.createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1]).send({from: accounts[0], gas: '1000000'});

        await campaign.methods.approveRequest(0).send({ from: accounts[0], gas: '1000000'});

        await campaign.methods.finalizeRequest(0).send({ from: accounts[0], gas: '10000000'});

        let finalBalance = await web3.eth.getBalance(accounts[1]);
        finalBalance = parseFloat(web3.utils.fromWei(finalBalance, 'ether'));
        initialBalance = parseFloat(web3.utils.fromWei(initialBalance, 'ether'));
        const difference = finalBalance - initialBalance;
        console.log(difference);
        assert(difference > 4);
    })
})