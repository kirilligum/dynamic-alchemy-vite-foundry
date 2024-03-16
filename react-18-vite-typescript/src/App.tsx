import React from 'react';
import { ethers } from 'ethers';
import CounterABI from '../../foundry/out/Counter.sol/Counter.json'; // Adjust the path to your ABI
const counterAddress = '0xd1f65f859609AFB5feC237b98Cd90f918bbb7dB9'; // Replace with your contract's address

import { useEffect, useState } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { createWalletClient, custom, type WalletClient } from "viem";
import {
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";

import "./App.css";


function App() {

  // const [signer, setSigner] = useState(null);
  // const { primaryWallet } = useDynamicContext();

  // useEffect(() => {
  //   const getSigner = async () => {
  //     if (!primaryWallet) return;

  //     const internalWalletClient =
  //       (await primaryWallet?.connector.getWalletClient()) as WalletClient;
  //     console.log(internalWalletClient);

  //     const walletClient = createWalletClient({
  //       chain: internalWalletClient.chain,
  //       transport: custom(internalWalletClient.transport),
  //       account: primaryWallet?.address,
  //     });

  //     setSigner(walletClient);
  //   };

  //   if (!signer) {
  //     getSigner();
  //   }
  // }, [primaryWallet]);

  // console.log("signer", signer);

  const [currentNumber, setCurrentNumber] = React.useState('Fetching...');


  const fetchNumber = async () => {
    const { primaryWallet } = useDynamicContext();
    const signer = await primaryWallet.connector.ethers?.getSigner();
    console.log("signer", signer);
    const counterContract = new ethers.Contract(counterAddress, CounterABI, signer);
    try {
      const number = await counterContract.getNumber();
      setCurrentNumber(number.toString());
    } catch (error) {
      console.error('Error fetching number:', error);
      setCurrentNumber('Error fetching number');
    }
  };

  useEffect(() => {
    fetchNumber();
  }, []);

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
