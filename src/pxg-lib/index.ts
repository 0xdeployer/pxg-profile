import { createAlchemyWeb3, AlchemyWeb3 } from "@alch/alchemy-web3";

import PxgLib, { InitWeb3Fn } from "pxg-js";

const initWeb3: InitWeb3Fn<AlchemyWeb3> = (provider) =>
  createAlchemyWeb3(
    "https://eth-mainnet.alchemyapi.io/v2/Zdn1C5wpuQp8N8ESdHIqSxSHQaZHGsY2",
    // @ts-ignore
    { writeProvider: provider }
  );

export const pxgLib = new PxgLib({
  initWeb3,
  // @ts-ignore
  initAccounts: () => window?.ethereum.enable(),
  network: "live",
});
