import { createAlchemyWeb3, AlchemyWeb3 } from "@alch/alchemy-web3";

import { provider } from "web3-core";

type EventCallback = (...args: any[]) => void;

class Emitter {
  events: {
    [eventName: string]: EventCallback[];
  };

  constructor() {
    this.events = {};
  }

  on(name: string, fn: EventCallback) {
    const event = this.events[name];
    if (event) {
      this.events[name].push(fn);
    } else {
      this.events[name] = [fn];
    }
  }

  once(name: string, fn: EventCallback) {
    // @ts-ignore
    fn.__once__ = true;
    this.on(name, fn);
  }

  emit(name: string, ...args: any[]) {
    const event = this.events[name];
    if (Array.isArray(event)) {
      event.forEach((fn, i) => {
        fn(...args);
        // @ts-ignore
        if (fn.__once__) {
          event.splice(i, 1);
        }
      });
    }
  }
}

const getBlock = (web3: AlchemyWeb3, ...args: any[]): Promise<number> =>
  new Promise((resolve) => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/ban-types
    web3.eth.getBlock(...args, (err: {}, block: { number: number }) => {
      resolve(err || !block ? -1 : block.number);
    });
  });

class PollTx extends Emitter {
  pending: string[];

  completed: string[];

  watching: boolean;

  web3: AlchemyWeb3;

  constructor(web3: AlchemyWeb3) {
    super();
    this.web3 = web3;
    this.pending = [];
    this.completed = [];
    this.watching = false;
  }

  // Public function that is called when the user wants to watch a transaction
  public watch(tx: string) {
    this.pending.push(tx);
    if (!this.watching) {
      this.startWatching();
    }
    // An event which is emitted with the updated list of pending transactions
    this.emit("pending", tx, this.pending);
  }

  getTransaction = (hash: string) =>
    new Promise((resolve, reject) => {
      this.web3.eth.getTransaction(hash, (err: any, data: any) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(data);
        }
      });
    });

  private internalWatch = async () => {
    if (!this.watching) {
      return;
    }
    const txData = await Promise.all(
      this.pending.map((tx) => this.getTransaction(tx))
    );

    // @ts-ignore
    const completed = txData.filter((tx) => !!tx && tx.blockNumber != null);

    if (completed.length > 0) {
      await Promise.all(
        completed.map((tx) =>
          (async () => {
            const { blockNumber } = tx as { blockNumber: number };
            let block;

            try {
              block = await getBlock(this.web3, "latest");
            } catch (e) {
              console.error(e.message);
            }

            if (block && block - blockNumber >= 0) {
              this.completedFn(tx as any);
            }
          })()
        )
      );
    }

    window.setTimeout(this.internalWatch, 1000);
  };

  // Internal function that begins to watch transactions in pending array
  startWatching() {
    if (this.watching) return;
    this.watching = true;
    this.internalWatch();
  }

  // Internal function that is called when a transaction has been completed
  completedFn(tx: { hash: string }) {
    // Remove completed transaction from pending array
    this.pending = this.pending.filter((t) => t !== tx.hash);
    this.completed.push(tx.hash);
    // An even which is emitted upon a completed transaction
    this.emit("completed", tx.hash, this.pending);
    if (this.pending.length === 0) {
      this.watching = false;
    }
  }
}

export class Web3Util extends Emitter {
  hasProvider: boolean;
  provider: provider;
  enabled = false;
  accounts?: string[];
  pollTx?: PollTx;
  web3?: AlchemyWeb3;

  constructor() {
    super();
    this.provider =
      // @ts-ignore
      window["ethereum"] || (window.web3 && window.web3.currentProvider);
    this.hasProvider = !!this.provider;
  }

  _setWeb3 = () => {
    if (this.provider) {
      const web3 = createAlchemyWeb3(
        "https://eth-mainnet.alchemyapi.io/v2/Zdn1C5wpuQp8N8ESdHIqSxSHQaZHGsY2",
        // @ts-ignore
        { writeProvider: this.provider }
      );
      this.pollTx = new PollTx(web3);

      this.web3 = web3;
      //@ts-ignore
      window.web3 = web3;
      this.pollTx = new PollTx(web3);
      return true;
    } else {
      return false;
    }
  };

  enable = async () => {
    if (this._setWeb3()) {
      // @ts-ignore
      if (this.provider && this.provider.isMetaMask) {
        // @ts-ignore
        window.ethereum.on("accountsChanged", (accounts) => {
          this.accounts = accounts;
          this.emit("accountsUpdated", this.accounts);
        });
      }

      if (this.provider) {
        if (!this.web3) throw new Error();
        // @ts-ignore
        const accounts = await window.ethereum.enable();
        // @ts-ignore
        const windowWeb3 = window.web3.eth.accounts;
        this.accounts = accounts || windowWeb3;
        this.emit("accountsUpdated", this.accounts);
      } else {
        // @ts-ignore
        this.accounts = window.web3.eth.accounts;
      }
      if (!this.accounts) {
        throw new Error("Accounts is undefined. User cancelled");
      }
      this.enabled = true;
    }
  };
}

const web3Util = new Web3Util();

export default web3Util;
