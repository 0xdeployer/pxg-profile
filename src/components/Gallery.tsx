import { css } from "@emotion/react";
import { Grid } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
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
                <Link
                  to={`/${data?.label}/${nft.contract_address}/${nft.token_id}`}
                >
                  <Nft nft={nft} />
                </Link>
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
              css={css`
                text-decoration: none;
              `}
              href={`https://oncyber.io/exhibits/${exhibitId}`}
            >
              <Button variant="round" arrowRight>
                View on Cyber
              </Button>
            </a>
          </P>
        </Spacer>
      )}
    </>
  );
}

export default Gallery;
