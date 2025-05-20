import { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";

const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
  const [wallet, setWallet] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      setWallet({ provider, signer });
    } else {
      alert("Install MetaMask to use crypto payments.");
    }
  };

  return (
    <Web3Context.Provider value={{ wallet, connectWallet }}>
      {children}
    </Web3Context.Provider>
  );
};
