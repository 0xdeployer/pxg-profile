import { css } from "@emotion/react";
import React from "react";
import { NFTFromCyber } from "./ProfileContext";

type NftProps = {
  nft: NFTFromCyber;
};

const styles = {
  root: css`
    border-radius: 1.2rem;
    overflow: hidden;
    & img {
      width: 100%;
      max-width: 100%;
      height: auto;
    }
  `,
};

function Nft({ nft }: NftProps) {
  return (
    <div css={styles.root}>
      <img src={nft.image_url} />
    </div>
  );
}

export default Nft;
