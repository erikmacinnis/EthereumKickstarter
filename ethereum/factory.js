// easily get access the the smart contract's web3 Contract object
import web3 from './web3';
import { abi } from '../artifacts/contracts/Kickstart.sol/CampaignFactory.json';

const instance = new web3.eth.Contract(abi, '0x8BA7F9d049268274206c3525AD1bB35b8818deD9');

export default instance
