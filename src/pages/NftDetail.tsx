import { css } from "@emotion/react";
import { Grid } from "@material-ui/core";
import React from "react";
import { useRouteMatch } from "react-router";
import { Link, Redirect } from "react-router-dom";
import Avatar from "../components/Avatar";
import Button from "../components/Button";
import FloatWrap from "../components/FloatWrap";
import Heading from "../components/Heading";
import P from "../components/P";
import { NFTFromCyber, ProfileContext } from "../components/ProfileContext";
import Spacer from "../components/Spacer";
import WalletAddress from "../components/WalletAddress";

// 72fdb7cff7064b70807e0f32d4ec3fa3

const styles = {
  imageFrame: css`
    border-radius: 1.6rem;
    overflow: hidden;
    & img {
      width: 100%;
      height: auto;
    }
  `,
  ownerFrame: css`
    background: #fff;
    border-radius: 1.2rem;
    padding: 2.4rem;
  `,
};

function NftDetail() {
  const [nft, updateNft] = React.useState<NFTFromCyber>();
  const context = React.useContext(ProfileContext);
  const {
    params: { address, tokenId, name },
  } = useRouteMatch<{ name: string; address: string; tokenId: string }>();

  React.useEffect(() => {
    const fn = async () => {
      const item = await fetch(
        `https://api.opensea.io/api/v1/asset/${address}/${tokenId}/`,
        {
          headers: {
            "X-API-KEY": "72fdb7cff7064b70807e0f32d4ec3fa3",
          },
        }
      ).then((response) => response.json());

      updateNft(item);
      console.log(item);
    };
    fn();
  }, []);
  if (
    nft &&
    context.data &&
    nft.owner.address.toLowerCase() !== context.data?.owner.toLowerCase()
  ) {
    return <Redirect to={`/${name}`} />;
  }
  return (
    <FloatWrap background="none">
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Spacer b="1.6rem">
            <Heading tag={3}>{nft?.collection.name}</Heading>
          </Spacer>
          <Spacer b="2.4rem">
            <Heading tag={1}>{nft?.name}</Heading>
          </Spacer>
          <Spacer b="2.4rem">
            <Heading tag={2}>{nft?.description}</Heading>
          </Spacer>
          <Spacer b="0.8rem">
            <Heading tag={4}>Contract</Heading>
          </Spacer>
          <Spacer b="2.4rem">
            <WalletAddress address={address} />
          </Spacer>
          <Spacer b="0.8rem">
            <Heading tag={4}>Token ID</Heading>
          </Spacer>
          <P>{tokenId}</P>
        </Grid>
        <Grid item xs={5}>
          <div css={styles.imageFrame}>
            <img src={nft?.image_url} />
          </div>
        </Grid>
        <Grid item xs={3}>
          <div css={styles.ownerFrame}>
            <Spacer b="0.8rem">
              <Heading tag={4}>Owned by</Heading>
            </Spacer>
            <Spacer b="1.2rem">
              <Avatar src={context.data?.avatar?.metadata?.image} />
            </Spacer>
            <P weight="bold">{`${context.data?.label}.pxg.eth`}</P>

            <Spacer t="2.4rem">
              <a
                css={css`
                  text-decoration: none;
                `}
                href={nft?.permalink}
                target="_blank"
                rel="noreferrer"
              >
                <Button arrowRight variant="round">
                  View on OpenSea
                </Button>
              </a>
            </Spacer>
          </div>
          <Spacer t="2.4rem">
            <Link
              css={css`
                text-decoration: none;
              `}
              to={`/${name}`}
            >
              <Button arrowLeft variant="roundAlt">
                Back to Gallery
              </Button>
            </Link>
          </Spacer>
        </Grid>
      </Grid>
    </FloatWrap>
  );
}

export default NftDetail;
