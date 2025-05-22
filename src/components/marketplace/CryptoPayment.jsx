import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  CircularProgress, 
  Alert,
  Paper,
  AlertTitle,
  Link
} from '@mui/material';
import { useWeb3 } from "../../web3/Web3Provider";
import { ethers } from "ethers";
import EscrowABI from "../../web3/escrow/EscrowABI.json";

const ESCROW_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

const CryptoPayment = ({ sellerAddress, amountETH, onPaymentComplete }) => {
  const { wallet, connectWallet } = useWeb3();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(null); // Added to categorize errors
  const [txHash, setTxHash] = useState(null);

  const handlePayment = async () => {
    if (!wallet) {
      try {
        await connectWallet();
        return; // Return early after connecting to handle in next click
      } catch (err) {
        setErrorType('wallet_connection');
        setError("Failed to connect wallet. Please make sure your wallet is unlocked and you've granted permission.");
        return;
      }
    }

    setIsLoading(true);
    setError(null);
    setErrorType(null);

    try {
      // Create contract instance
      const contract = new ethers.Contract(
        ESCROW_ADDRESS,
        EscrowABI,
        wallet.signer
      );

      // Use parseEther directly from ethers (not from ethers.utils)
      const tx = await contract.deposit(sellerAddress, {
        value: ethers.parseEther(amountETH.toString()),
      });

      await tx.wait();

      setTxHash(tx.hash);

      if (onPaymentComplete) {
        onPaymentComplete({
          txHash: tx.hash,
          contractAddress: ESCROW_ADDRESS,
          amount: amountETH,
        });
      }
    } catch (err) {
      console.error("Payment error:", err);
      
      // Categorize common errors for better user feedback
      if (err.message && err.message.includes("insufficient funds")) {
        setErrorType('insufficient_funds');
        setError("Your wallet doesn't have enough ETH to complete this transaction. Please add funds to your wallet and try again.");
      } 
      else if (err.message && err.message.includes("user rejected transaction")) {
        setErrorType('user_rejected');
        setError("You declined the transaction in your wallet. Please try again when you're ready to proceed.");
      }
      else if (err.message && err.message.includes("gas required exceeds allowance")) {
        setErrorType('gas_limit');
        setError("The transaction requires more gas than allowed. Try increasing your gas limit in your wallet settings.");
      }
      else if (err.code === "NETWORK_ERROR" || (err.message && err.message.includes("network"))) {
        setErrorType('network_error');
        setError("Network connection issue. Please check your internet connection and wallet network settings.");
      }
      else {
        setErrorType('unexpected_error');
        setError("An unexpected error occurred. Please try again or contact support if the issue persists.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Render success state
  if (txHash) {
    return (
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          <AlertTitle>Payment Successful!</AlertTitle>
          Your funds are now in escrow and will be released to the seller when you confirm delivery.
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
            <Link 
              href={`https://etherscan.io/tx/${txHash}`} 
              target="_blank"
              rel="noopener noreferrer"
              sx={{ display: 'block', mt: 1, fontSize: '0.8rem' }}
            >
              View on Etherscan ↗
            </Link>
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
            {ESCROW_ADDRESS}
            <Link 
              href={`https://etherscan.io/address/${ESCROW_ADDRESS}`} 
              target="_blank"
              rel="noopener noreferrer"
              sx={{ display: 'block', mt: 1, fontSize: '0.8rem' }}
            >
              View contract on Etherscan ↗
            </Link>
          </Typography>
        </Box>

        <Button 
          variant="contained" 
          color="primary" 
          fullWidth
          onClick={() => onPaymentComplete && onPaymentComplete({
            txHash,
            contractAddress: ESCROW_ADDRESS,
            amount: amountETH
          })}
        >
          Continue to Order Confirmation
        </Button>
      </Paper>
    );
  }

  // Render specific error alerts based on error type
  const renderErrorMessage = () => {
    if (!error) return null;

    const errorIcons = {
      insufficient_funds: '💰',
      wallet_connection: '🔌',
      user_rejected: '❌',
      gas_limit: '⛽',
      network_error: '🌐',
      unexpected_error: '⚠️'
    };

    const icon = errorIcons[errorType] || '⚠️';
    
    let helpText = '';
    let severity = 'error';
    
    // Customize help text based on error type
    if (errorType === 'insufficient_funds') {
      helpText = "You need to add more ETH to your wallet before continuing. You can get ETH from an exchange or another wallet.";
      severity = 'warning';
    } else if (errorType === 'wallet_connection') {
      helpText = "Make sure your MetaMask extension is active and on the correct network (Ethereum Mainnet).";
      severity = 'info';
    } else if (errorType === 'user_rejected') {
      helpText = "You can try again whenever you're ready to proceed with the payment.";
      severity = 'info';
    } else if (errorType === 'network_error') {
      helpText = "Check that you're connected to the internet and your wallet is on the correct network.";
      severity = 'warning';
    }
    
    return (
      <Alert 
        severity={severity} 
        sx={{ 
          mb: 2, 
          border: '1px solid',
          borderColor: severity === 'error' ? 'error.light' : 
                      severity === 'warning' ? 'warning.light' : 'info.light',
          borderRadius: 2
        }}
      >
        <AlertTitle>
          {icon} {errorType === 'insufficient_funds' ? 'Insufficient Funds' : 
             errorType === 'user_rejected' ? 'Transaction Declined' :
             errorType === 'network_error' ? 'Network Error' :
             errorType === 'wallet_connection' ? 'Wallet Connection Issue' :
             'Transaction Error'}
        </AlertTitle>
        {error}
        {helpText && <Typography variant="body2" sx={{ mt: 1 }}>{helpText}</Typography>}
      </Alert>
    );
  };

  return (
    <Box>
      {renderErrorMessage()}

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
        {isLoading ? 'Processing...' : wallet ? `Pay ${amountETH.toFixed(6)} ETH` : 'Connect Wallet'}
      </Button>

      <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
        Payment is processed via Ethereum blockchain with escrow protection.
        {!wallet && (
          <Box component="span" sx={{ display: 'block', mt: 1, fontWeight: 'medium' }}>
            You'll need to connect your Ethereum wallet (like MetaMask) to continue.
          </Box>
        )}
      </Typography>

      {wallet && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(55, 114, 255, 0.05)', borderRadius: 2 }}>
          <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
            Transaction will be sent from:
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              wordBreak: 'break-all',
              fontFamily: 'monospace',
              fontWeight: 'medium'
            }}
          >
            {wallet.address || 'Loading address...'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CryptoPayment;