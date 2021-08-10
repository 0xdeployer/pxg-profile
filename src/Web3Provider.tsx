import React from "react";
import { pxgLib } from "./pxg-lib";

export const Web3Context = React.createContext<{
  hasProvider: boolean;
  accounts?: string[];
  connected: boolean;
} | null>(null);

function Web3Provider({ children }: { children: React.ReactNode }) {
  const [accounts, updateAccounts] = React.useState<string[]>();
  console.log(accounts);
  React.useEffect(() => {
    pxgLib.on("accountsUpdated", (newAccounts: string[]) => {
      console.log("hi");
      updateAccounts(newAccounts);
    });
  }, []);

  return (
    <Web3Context.Provider
      value={{
        hasProvider: pxgLib.hasProvider,
        accounts,
        connected: !!accounts,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export default Web3Provider;
