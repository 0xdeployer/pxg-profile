import { css } from "@emotion/react";
import React from "react";
import P from "./P";

type WalletAddressProps = {
  address: string;
};

function WalletAddress({ address }: WalletAddressProps) {
  const firstHalf = address.substring(0, 6);
  const secondHalf = address.substring(address.length - 6);
  return (
    <a
      target="_blank"
      rel="noreferrer"
      href={`https://etherscan.com/address/${address}`}
    >
      <P
        styles={{
          root: css`
            background: #ededed;
            color: #8c8c8c;
            padding: 0.4rem 0.8rem;
            border: 1px solid #ccc;
            border-radius: 8rem;
            display: inline-block;
            font-size: 1.4rem;
          `,
        }}
      >{`${firstHalf}...${secondHalf}`}</P>
    </a>
  );
}

export default WalletAddress;
