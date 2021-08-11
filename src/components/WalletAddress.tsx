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
    <P
      styles={{
        root: css`
          background: #ededed;
          color: #8c8c8c;
          padding: 0.4rem 0.8rem;
          border-radius: 8rem;
          display: inline-block;
          font-size: 1.4rem;
        `,
      }}
    >{`${firstHalf}...${secondHalf}`}</P>
  );
}

export default WalletAddress;
