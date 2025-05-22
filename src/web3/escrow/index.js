import { ethers } from "ethers";
import EscrowABI from "./EscrowABI.json";

// Replace this with your deployed contract address
contract_address= import.meta.env.CONTRACT_ADDRESS || "0x2b1bf6d44777f787a930ac3167a3a65a83a3913d";


export function getEscrowContract(signerOrProvider) {
  return new ethers.Contract(contract_address, EscrowABI, signerOrProvider);
}
