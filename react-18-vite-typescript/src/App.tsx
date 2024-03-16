import React from 'react';
import { ethers } from 'ethers';
import CounterABI from '../../foundry/out/Counter.sol/Counter.json'; // Adjust the path to your ABI
const counterAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your contract's address
import { createModularAccountAlchemyClient } from "@alchemy/aa-alchemy";
import { sepolia } from "@alchemy/aa-core";
import { WalletClientSigner, type SmartAccountSigner } from "@alchemy/aa-core";


import {
  DynamicWidget,
  DynamicContextProvider,
  useDynamicContext,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

import "./App.css";

const chain = sepolia;

function Test() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { primaryWallet } = useDynamicContext();

  const dynamicProvider = primaryWallet?.connector?.getWalletClient();

  console.log("dynamicProvider:", dynamicProvider);

  // a smart account signer you can use as an owner on ISmartContractAccount
  const dynamicSigner: SmartAccountSigner = new WalletClientSigner(
    dynamicProvider,
    "dynamic" // signer type
  );
  console.log(dynamicSigner)
  const provider = createModularAccountAlchemyClient({
    apiKey: import.meta.env.VITE_PUBLIC_ALCHEMY_API_KEY,
    chain,
    signer: dynamicSigner,
  });

  console.log("provider:", provider);

  async function setNumber(value) {
    if (!dynamicProvider) {
      console.error('Wallet provider is not initialized.');
      return;
    }
    const signer = dynamicProvider.getSigner();
    const counterContract = new ethers.Contract(counterAddress, CounterABI, signer);
    try {
      const tx = await counterContract.setNumber(value);
      await tx.wait();
      console.log(`Number set to ${value}`);
    } catch (error) {
      console.error('Error setting number:', error);
    }
  }

  const [inputValue, setInputValue] = React.useState('');
  const [currentNumber, setCurrentNumber] = React.useState('Fetching...');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const fetchNumber = async () => {
    if (!dynamicProvider) {
      console.error('Wallet provider is not initialized.');
      return;
    }
    const signer = dynamicProvider.getSigner();
    const counterContract = new ethers.Contract(counterAddress, CounterABI, signer);
    try {
      const number = await counterContract.getNumber();
      setCurrentNumber(number.toString());
    } catch (error) {
      console.error('Error fetching number:', error);
      setCurrentNumber('Error fetching number');
    }
  };

  React.useEffect(() => {
    fetchNumber();
  }, []);

  const handleSubmit = async () => {
    const number = parseInt(inputValue, 10);
    if (!isNaN(number)) {
      await setNumber(number);
    }
  };

  return (
    <div>
      <input type="number" value={inputValue} onChange={handleInputChange} />
      <button onClick={handleSubmit}>Set Number</button>
      <div>Current Number: {currentNumber}</div>
      <button onClick={fetchNumber}>Refresh Number</button>
    </div>
  );
}

function App() {
  return (
    <>
      <div>
        <DynamicContextProvider
          settings={{
            environmentId: import.meta.env.VITE_DYNAMIC_ID,
            walletConnectors: [EthereumWalletConnectors],
          }}
        >
          <DynamicWidget />
          <Test />
        </DynamicContextProvider>
      </div>
    </>
  );
}

export default App;
