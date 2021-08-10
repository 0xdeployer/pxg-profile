import Web3 from "web3";
import { Web3Util } from "./web3.util";
import { provider } from "web3-core";
import { abi } from "./contracts/glyphs.json";
import { abi as resolverAbi } from "./contracts/resolver.json";
import { abi as registrarAbi } from "./contracts/registrar.json";
// @ts-ignore
import namehash from "eth-ens-namehash";

export type AvatarType = {
  address: string;
  tokenId: string;
  metadata: {};
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
    resolver: "0x52510235Eb5377eFF7EBde36FAF6fe55669438a5",
    registrar: "0xFd085b383D64F87bBC84B8Cbf86A170E60204D52",
    glyphs: "0x8ec87688325fB4d358f45529Db45C3Ac778f3F9b",
  },
  rinkeby: {
    resolver: "0xAaf62011219Eb61231A49577B8C1eB149a237287",
    registrar: "0x4CF84d4Cf28d17EA515ac13D002F5a239dB838E1",
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
};

type Network = keyof typeof REQUEST_URL;

export default class PxgLib extends Web3Util {
  network: Network;
  contracts: ContractTypes;

  constants = {
    ZERO_ADDRESS,
  };

  constructor(options?: { network?: Network }) {
    super();
    this.network = options?.network ?? "local";
    switch (this.network) {
      case "local":
        this.contracts = CONTRACTS.local;
        break;
      default:
        throw new Error("Should have network set");
    }
  }

  reverseLookup() {}

  private err(msg?: string) {
    throw new Error(`PXG LIB: ${msg ?? ""}`);
  }

  private getContract(name: keyof ContractTypes) {
    if (!this.web3) return this.err("Web3 not defined");
    return new this.web3.eth.Contract(ABI[name] as any, this.contracts[name]);
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
      label: `${label}.pxg.eth`,
    };
  }

  ownerOfNode(label: string) {
    const contract = this.getContract("registrar");
    if (!contract) throw new Error();
    return contract.methods.getOwnerFromNode(this.getNode(label)).call();
  }

  private getNode(subdomain: string) {
    return namehash.hash(namehash.normalize(`${subdomain}.pxg.eth`));
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
      .claimGlyph("hello", 1)
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

    // const tokenUri = await nftContract.methods.tokenURI(tokenId).call();

    const tokenUri = "https://pxg-prod.herokuapp.com/metadata/1";

    alert(tokenUri);

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
}

export function normalizeIpfs(str: string) {
  return str.replace("ipfs://", "https://ipfs.infura.io/ipfs/");
}

export const pxgLib = new PxgLib();
