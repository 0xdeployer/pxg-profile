import { Web3Util } from "./web3.util";
import { abi } from "./contracts/glyphs.json";
import { abi as resolverAbi } from "./contracts/resolver.json";
import { abi as registrarAbi } from "./contracts/registrar.json";
import { abi as test721Abi } from "./contracts/test721.json";
import isURL from "validator/lib/isURL";
// @ts-ignore
import namehash from "eth-ens-namehash";

export type AvatarType = {
  address: string;
  tokenId: string;
  metadata: any;
};

export type Links = {
  opensea: string;
  makersplace: string;
  knownorigin: string;
  foundation: string;
  rarible: string;
  superrare: string;
  cargo: string;

  twitter: string;
  instagram: string;
  discord: string;
  telegram: string;
};

export type ContractTypes = {
  resolver: string;
  registrar: string;
  glyphs: string;
};

export type Metadata = {
  name: string;
  image: string;
  tokenId: string;
};

const CONTRACTS = {
  local: {
    resolver: "0x6BcB3aC8641a9535888299EdE7D15EC3aE9e7071",
    registrar: "0x70890aFeC0E5758A729787Eb08c981151C33A228",
    glyphs: "0xc82BA0a9eDCD3DBf23AF7974F155720C50ac6eaF",
  },
  rinkeby: {
    resolver: "0x066134888FC6eb1AD0A8fe7C22402dB9b0E408d9",
    registrar: "0xB454A2d8Fca4FfA3747E8c90bE99d865cb44F98c",
    glyphs: "0x7605F0BbbFfc6A12Fb5a9b969Fb969f36AE6d777",
  },
};

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const ABI = {
  glyphs: abi,
  registrar: registrarAbi,
  resolver: resolverAbi,
};

const REQUEST_URL = {
  local: "http://localhost:3000",
  rinkeby: "http://localhost:3000",
};

const NODES = {
  local: "pxg.eth",
  rinkeby: "pxgtester.test",
  live: "pxg.eth",
};

type Network = keyof typeof REQUEST_URL;

export default class PxgLib extends Web3Util {
  network: Network;
  contracts: ContractTypes;
  requestUrl: string;

  constants = {
    ZERO_ADDRESS,
    NODE: "",
  };

  constructor(options?: { network?: Network }) {
    super();
    this.network = options?.network ?? "local";
    this.requestUrl = REQUEST_URL[this.network];
    this.constants.NODE = NODES[this.network];
    switch (this.network) {
      case "local":
        this.contracts = CONTRACTS.local;
        break;
      case "rinkeby":
        this.contracts = CONTRACTS.rinkeby;
        break;
      default:
        throw new Error("Should have network set");
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  reverseLookup() {}

  private err(msg?: string) {
    throw new Error(`PXG LIB: ${msg ?? ""}`);
  }

  getContract(name: keyof ContractTypes) {
    if (!this.web3) return this.err("Web3 not defined");
    return new this.web3.eth.Contract(ABI[name] as any, this.contracts[name]);
  }

  mintTest(id: string) {
    const web3 = this.web3;
    if (!web3) return;
    if (!this.accounts) return;
    // @ts-ignore
    const contract = new web3.eth.Contract(test721Abi, this.contracts.glyphs);
    return contract.methods
      .mint(id, this.accounts[0])
      .send({ from: this.accounts[0] });
  }

  async getGlyphs() {
    if (!this.web3) return this.err("Web3 not defined");
    if (!this.accounts?.[0]) return this.err("Accounts not available");

    const contract = this.getContract("glyphs");
    if (!contract) throw new Error();
    let balance = await contract.methods.balanceOf(this.accounts[0]).call();
    balance = parseInt(balance);
    const p = [];
    for (let i = 0; i < balance; i++) {
      const [account] = this.accounts;
      const fn: () => Promise<Metadata> = async () => {
        const tokenId = await contract.methods
          .tokenOfOwnerByIndex(account, i)
          .call();
        if (this.network === "local")
          return { name: `Test ${1}`, image: "", tokenId };
        const metadata = await fetch(
          `${REQUEST_URL}/metadata/${tokenId.toString()}`
        ).then((res) => {
          return res.json();
        });
        return metadata as unknown as Metadata;
      };
      p.push(fn());
    }

    return Promise.all(p);
  }

  balanceOf(address: string = this.accounts?.[0] ?? "") {
    const contract = this.getContract("registrar");
    if (!contract) throw new Error();
    return contract.methods.balanceOf(address).call();
  }

  async tokenOfOwnerByIndex(
    idx: number,
    address: string = this.accounts?.[0] ?? ""
  ) {
    const contract = this.getContract("registrar");
    if (!contract) throw new Error();
    const token = await contract.methods
      .tokenOfOwnerByIndex(address, idx)
      .call();
    const label = await contract.methods
      .nodeToLabel(this.web3?.utils.numberToHex(token))
      .call();
    return {
      tokenId: token,
      label: `${label}.${this.constants.NODE}`,
      name: label,
    };
  }

  ownerOfNode(label: string) {
    const contract = this.getContract("registrar");
    if (!contract) throw new Error();
    return contract.methods.getOwnerFromNode(this.getNode(label)).call();
  }

  private getNode(subdomain: string) {
    return namehash.hash(
      namehash.normalize(`${subdomain}.${this.constants.NODE}`)
    );
  }

  getReverseRecord(address: string) {
    const contract = this.getContract("registrar");
    if (!contract) throw new Error();
    return contract.methods.getReverseRecord(address).call();
  }

  claimFromGlyph(glyphId: string, input: string) {
    const contract = this.getContract("registrar");
    if (!contract) throw new Error();
    return contract.methods
      .claimGlyph(input, glyphId)
      .send({ from: this.accounts?.[0] });
  }

  setDefaultAvatar(
    subdomain: string,
    collectionAddress: string,
    tokenId: string | number
  ) {
    const contract = this.getContract("resolver");
    if (!contract) throw new Error();
    return contract.methods
      .setDefaultAvatar(this.getNode(subdomain), collectionAddress, tokenId)
      .send({ from: this.accounts?.[0] });
  }

  async getDefaultAvatar(subdomain: string): Promise<AvatarType> {
    const contract = this.getContract("resolver");
    if (!contract) throw new Error();
    const { 0: address, 1: tokenId } = await contract.methods
      .getDefaultAvatar(this.getNode(subdomain))
      .call();

    if (address === this.constants.ZERO_ADDRESS) {
      return {
        address,
        tokenId,
        metadata: {},
      };
    }

    if (!this.web3) throw new Error();

    const nftContract = new this.web3.eth.Contract(abi as any, address);

    const tokenUri = await nftContract.methods.tokenURI(tokenId).call();

    // const tokenUri = "https://pxg-prod.herokuapp.com/metadata/1";

    let metadata = {};

    if (tokenUri) {
      metadata = await fetch(normalizeIpfs(tokenUri)).then((res) => res.json());
    }

    return {
      tokenId,
      address,
      metadata,
    };
  }

  async setLinks(label: string, links: Links) {
    const values = Object.values(links);

    if (
      !values.every(
        (item) => isURL(item, { require_protocol: false }) || item === ""
      )
    ) {
      throw new Error("invalid url");
    }
    const timestamp = await fetch(`${this.requestUrl}/timestamp`).then(
      (res) => {
        return res.text();
      }
    );
    const message = `To confirm ownership of this address, please sign this message.\n\nTimestamp: ${timestamp}`;
    const signature = await this.signMessage(message);
    return fetch(`${this.requestUrl}/set-links`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timestamp,
        signature,
        links,
        label,
      }),
    });
  }

  // await getSupportedCollection() {
  //   const contract = this.getContract('resolver');
  //   contract.getPastEvents
  // }

  getLinks(label: string) {
    return fetch(`${this.requestUrl}/get-links/${label}`).then((res) =>
      res.json()
    );
  }

  async setDefaultGallery(label: string, exhibitId: string) {
    const timestamp = await fetch(`${this.requestUrl}/timestamp`).then(
      (res) => {
        return res.text();
      }
    );
    const message = `To confirm ownership of this address, please sign this message.\n\nTimestamp: ${timestamp}`;
    const signature = await this.signMessage(message);
    return fetch(`${this.requestUrl}/set-gallery`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timestamp,
        signature,
        exhibitId,
        label,
      }),
    });
  }

  async getDefaultGallery(label: string) {
    return fetch(`${this.requestUrl}/get-gallery/${label}`).then((res) =>
      res.json()
    );
  }

  private signMessage(signingMessage: string) {
    return new Promise((resolve, reject) => {
      if (!this.web3 || !this.accounts?.[0]) return;
      this.web3.eth.personal.sign(
        signingMessage,
        this.accounts[0],
        // @ts-ignore
        (err: Error, result: any) => {
          if (err) return reject(new Error(err.message));
          if (result.error) {
            return reject(new Error(result.error.message));
          }
          resolve(result);
        }
      );
    });
  }
}

export function normalizeIpfs(str: string) {
  return str.replace("ipfs://", "https://ipfs.infura.io/ipfs/");
}

export const pxgLib = new PxgLib({ network: "rinkeby" });

// @ts-ignore
window.pxgLib = pxgLib;
