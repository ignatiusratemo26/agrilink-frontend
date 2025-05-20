import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  CircularProgress, 
  Alert,
  Paper
} from '@mui/material';
import { useWeb3 } from "../../web3/Web3Provider";
import { ethers } from "ethers";
import EscrowABI from "../../web3/escrow/EscrowABI.json";

const CryptoPayment = ({ sellerAddress, amountETH, onPaymentComplete }) => {
  const { wallet, connectWallet } = useWeb3();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [contractAddress, setContractAddress] = useState(null);

  const handlePayment = async () => {
    if (!wallet) {
      try {
        await connectWallet();
      } catch (err) {
        setError("Failed to connect wallet. Please try again.");
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const escrowContract = new ethers.ContractFactory(
        EscrowABI,
        EscrowBytecode, // if deploying from frontend; else use deployed address
        wallet.signer
      );

      const contract = await escrowContract.deploy(sellerAddress, {
        value: ethers.parseEther(amountETH.toString()),
      });

      await contract.deployed();
      
      setTxHash(contract.deployTransaction.hash);
      setContractAddress(contract.address);
      
      // Call the onPaymentComplete callback
      if (onPaymentComplete) {
        onPaymentComplete({
          txHash: contract.deployTransaction.hash,
          contractAddress: contract.address,
          amount: amountETH
        });
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message || "Transaction failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (contractAddress && txHash) {
    return (
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          Payment successful! Your funds are now in escrow.
        </Alert>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>Transaction Hash:</Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              wordBreak: 'break-all',
              backgroundColor: '#f5f5f5',
              p: 1,
              borderRadius: 1
            }}
          >
            {txHash}
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>Escrow Contract:</Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              wordBreak: 'break-all',
              backgroundColor: '#f5f5f5',
              p: 1,
              borderRadius: 1
            }}
          >
            {contractAddress}
          </Typography>
        </Box>
        
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth
          onClick={() => onPaymentComplete && onPaymentComplete({
            txHash,
            contractAddress,
            amount: amountETH
          })}
        >
          Continue to Order Confirmation
        </Button>
      </Paper>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Button
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        onClick={handlePayment}
        disabled={isLoading}
        sx={{ 
          py: 2,
          backgroundColor: '#3772ff',
          '&:hover': {
            backgroundColor: '#2954c8'
          }
        }}
        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
      >
        {isLoading ? 'Processing...' : `Pay ${amountETH.toFixed(6)} ETH`}
      </Button>
      
      <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
        Payment is processed via Ethereum blockchain with escrow protection.
      </Typography>
    </Box>
  );
};

export default CryptoPayment;