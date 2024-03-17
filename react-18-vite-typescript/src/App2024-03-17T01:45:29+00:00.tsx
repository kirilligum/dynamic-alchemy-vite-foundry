import React from 'react';
import { ethers } from 'ethers';
import CounterABI from '../../abi/Counter.json'; // Adjust the path to your ABI
// import CounterABI from '../../foundry/out/Counter.sol/Counter.json'; // Adjust the path to your ABI
const counterAddress = '0xd5888F0a82235B038693e0e4A24be9f5c9602272'; // Replace with your contract's address

import { useEffect, useState } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { createWalletClient, custom, type WalletClient } from "viem";
import {
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";

import "./App.css";


function App() {


  const [currentNumber, setCurrentNumber] = React.useState('Fetching...');


  const { primaryWallet } = useDynamicContext();
  const fetchNumber = async () => {
    if (!primaryWallet) return;
    const signer = await primaryWallet.connector.ethers?.getSigner();
    console.log("signer", signer);
    const counterContract = new ethers.Contract(counterAddress, CounterABI, signer);
    try {
      const number = await counterContract.getNumber();
      console.log("number", number.toString());
      setCurrentNumber(number.toString());
    } catch (error) {
      console.error('Error fetching number:', error);
      setCurrentNumber('Error fetching number');
    }
  };
  console.log("primaryWallet", primaryWallet);
  // useEffect(() => {
  //   fetchNumber();
  // }, [primaryWallet]);

  return (
    <>
      <DynamicWidget />
      <div>Current Number: {currentNumber}</div>
      <button onClick={fetchNumber}>Refresh Number</button>
      {/* <Test /> */}
    </>
  );
}

export default App;
