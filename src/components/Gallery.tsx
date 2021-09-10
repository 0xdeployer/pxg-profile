import { css } from "@emotion/react";
import { Grid } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import Nft from "./Nft";
import P from "./P";
import { ProfileContext } from "./ProfileContext";
import Spacer from "./Spacer";

const styles = {
  empty: css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    & p {
      color: #8c8c8c;
    }
    & > div {
      max-width: 470px;
    }
  `,
};

function Gallery() {
  const { nfts, data, exhibitId, exhibitsLoading } =
    React.useContext(ProfileContext);

  return (
    <>
      {!exhibitId && data?.owner && !exhibitsLoading && (
        <div css={styles.empty}>
          <div>
            <P weight="bold">
              There is no default gallery set for this profile. If you are the
              owner of this name create an NFT gallery on{" "}
              <a href="https://oncyber.io/" target="_blank" rel="noreferrer">
                Cyber
              </a>{" "}
              and set it as the default{" "}
              <Link to={`/${data?.label}/edit/gallery`}>here</Link>.
            </P>
          </div>
        </div>
      )}
      <Grid container spacing={2}>
        {nfts &&
          nfts.length > 0 &&
          nfts.map((nft, i) => {
            return (
              <Grid key={i} item xs={12} sm={6} md={4}>
                <Link
                  to={`/${data?.label}/${
                    nft.contract_address ?? nft.token_address
                  }/${nft.token_id}`}
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
