import React from 'react';
import { Contract, ethers } from 'ethers';
import CounterABI from '../../abi/Counter.json'; // Adjust the path to your ABI
// import CounterABI from '../../foundry/out/Counter.sol/Counter.json'; // Adjust the path to your ABI
const counterAddress = '0xd5888F0a82235B038693e0e4A24be9f5c9602272'; // Replace with your contract's address
import { useEffect, useState } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { createWalletClient, custom, PublicClient, type WalletClient } from "viem";
import {
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";

import "./App.css";


function App() {


  const [currentNumber, setCurrentNumber] = React.useState('Fetching...');


  const { primaryWallet, network } = useDynamicContext();
  const inc = async () => {
    if (!primaryWallet) return;
    const publicClient: PublicClient = await primaryWallet.connector.getPublicClient();
    const walletClient: WalletClient = await primaryWallet.connector.getWalletClient(network);
    //const signer =  await primaryWallet.connector.ethers.getSigner();
    //const counterContract = new ethers.Contract(counterAddress, CounterABI, signer);
    try {
      const account = (await walletClient.getAddresses());
      console.log(account, primaryWallet.address)
      const { request } = await publicClient.simulateContract({
        // @ts-ignore
        account: primaryWallet.address,
        address: counterAddress,
        abi: CounterABI,
        functionName: 'increment',
      })
      const hash = await walletClient.writeContract(request)
      //const tx = await counterContract.increment();
      //console.log("data", data);
      console.log('tx hash', hash);
    } catch (error) {
      console.error('Error inc number:', error);
    }
  }
  const fetchNumber = async () => {
    if (!primaryWallet) return;
    //const signer =  await primaryWallet.connector.ethers.getSigner();
    //const counterContract = new ethers.Contract(counterAddress, CounterABI, signer);

    const publicClient = await primaryWallet.connector.getPublicClient();
    try {
      const data = await publicClient.readContract({
        address: counterAddress,
        abi: CounterABI,
        functionName: 'getNumber',
        args: []
      })
      //const number = await counterContract.getNumber();
      console.log("data", data);
      //console.log('number', number);
      setCurrentNumber(data.toString());
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
      <button onClick={inc}>Inc Number</button>

      {/* <Test /> */}
    </>
  );
}

export default App;
