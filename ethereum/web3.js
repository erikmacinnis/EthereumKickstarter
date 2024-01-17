// This is necessary to use the web3 object with the correct provider
import Web3 from "web3";

let web3;
 
// typeof window !== "undefined" checks if we are running in the browser 
// typeof window.ethereum !== "undefined" checks if MetaMask is running
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running.
  // request the metamask accounts
  window.ethereum.request({ method: "eth_requestAccounts" });
  // gets provider from metamask
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server *OR* the user is not running metamask
  // we are creating our own provider
  const provider = new Web3.providers.HttpProvider(
    //Infura api link
  );
  web3 = new Web3(provider);
}
 
export default web3;