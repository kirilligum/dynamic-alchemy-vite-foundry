import { WalletClientSigner, type SmartAccountSigner } from "@alchemy/aa-core";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect } from "react";
import { createModularAccountAlchemyClient } from "@alchemy/aa-alchemy";
import { sepolia } from "viem/chains";
import { type WalletClient } from "viem";

const useAlchemy = () => {
  const { primaryWallet } = useDynamicContext();

  useEffect(() => {
    const init = async () => {
      const dynamicProvider =
        (await primaryWallet?.connector?.getWalletClient()) as WalletClient;

      if (!dynamicProvider) return null;

      const dynamicSigner: SmartAccountSigner = new WalletClientSigner(
        dynamicProvider,
        "dynamic"
      );

      const chain = sepolia;

      const client = await createModularAccountAlchemyClient({
        apiKey: "dzP8YA4LLHp5ssFcQEnOU4Q0qjH0ceJk",
        chain,
        signer: dynamicSigner,
      });

      return client;
    };

    init();
  }, [primaryWallet]);

  return;
};

export default useAlchemy;
