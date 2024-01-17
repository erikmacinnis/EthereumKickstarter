pragma solidity ^0.8.9;

contract CampaignFactory{
    //The public get method of this only allows us to look at one element at a time
    address[] public deployedCampaigns;
    address public CampaignFactoryAddress;
    Campaign public newCampaign;

    function createCampaign(address manager, uint minimum) external {
        CampaignFactoryAddress = address(this);
        newCampaign = new Campaign(manager, minimum);
        address newCampaignAddress = address(newCampaign);
        deployedCampaigns.push(newCampaignAddress);
    }
    // we have this function so we can look at the whole array
    function getDeployedCampaigns() external view returns(address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {

    struct Request {
        string name;
        uint value;
        address payable recipient;
        bool approved;
        int approvals;
        uint total;
    }

    address public manager;
    uint public minimumContribution;
    uint public approverCount;
    mapping(address => bool) public approvers;
    mapping(uint => mapping(address => bool)) public whoVoted;
    Request[] public requests;

    function owner(address _owner) private view{
        require(manager == _owner);
    }

    function toApprove(uint whichRequest, address addy) private view{
        require(!whoVoted[whichRequest][addy]);
        require(approvers[addy]);
    }

    constructor(address _manager, uint _minimumContribution){
        manager = _manager;
        minimumContribution = _minimumContribution;
    }

    function contribute() external payable {
        if (msg.value > minimumContribution){
            approvers[msg.sender] = true;
            approverCount++;
        }
    }

    function createRequest(string memory name, uint value, address payable recipient) external {
        owner(msg.sender);
        requests.push(Request(name, value, recipient, false, 0, 0));
    }

    function approveRequest(uint whichRequest) external {
        toApprove(whichRequest, msg.sender);
        whoVoted[whichRequest][msg.sender] = true;
        requests[whichRequest].approvals++;
        requests[whichRequest].total++;
    }

    function disaproveRequest(uint whichRequest) external {
        toApprove(whichRequest, msg.sender);
        whoVoted[whichRequest][msg.sender] = true;
        requests[whichRequest].approvals--;
        requests[whichRequest].total++;
    }

    function finalizeRequest(uint whichRequest) external {
        owner(msg.sender);
        Request storage request = requests[whichRequest];
        require(request.total > (approverCount/2));
        require(request.approvals > 0);
        require(!request.approved);
        request.recipient.transfer(request.value);
        request.approved = true;
    }
}