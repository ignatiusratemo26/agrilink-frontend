import { ethers } from "ethers";
import EscrowABI from "./EscrowABI.json";

// Replace this with your deployed contract address
contract_address= import.meta.env.VITE_CONTRACT_ADDRESS;


export function getEscrowContract(signerOrProvider) {
  return new ethers.Contract(contract_address, EscrowABI, signerOrProvider);
}
