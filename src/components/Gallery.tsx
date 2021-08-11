import { css } from "@emotion/react";
import { Grid } from "@material-ui/core";
import React from "react";
import Nft from "./Nft";
import P from "./P";
import { ProfileContext } from "./ProfileContext";
import Spacer from "./Spacer";

function Gallery() {
  const { nfts, data, exhibitId } = React.useContext(ProfileContext);
  const hasNfts = nfts && nfts.length > 0;

  return (
    <>
      <Grid container spacing={2}>
        {nfts &&
          nfts.length > 0 &&
          nfts.map((nft) => {
            return (
              <Grid item xs={4}>
                <Nft nft={nft} />
              </Grid>
            );
          })}
      </Grid>
      {exhibitId && (
        <Spacer
          styles={{
            root: css`
              display: flex;
              justify-content: flex-end;
            `,
          }}
          t="1.2rem"
        >
          <P
            styles={{
              root: css`
                font-size: 1.4rem;
              `,
            }}
          >
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://oncyber.io/exhibits/${exhibitId}`}
            >
              View on Cyber
            </a>
          </P>
        </Spacer>
      )}
    </>
  );
}

export default Gallery;
