import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import FloatWrap from "../components/FloatWrap";
import { Web3Context } from "../Web3Provider";
import Grid from "@material-ui/core/Grid";
import { css } from "@emotion/react";
import { ProfileContext } from "../components/ProfileContext";
import Avatar from "../components/Avatar";

import P from "../components/P";
import Spacer from "../components/Spacer";
import WalletAddress from "../components/WalletAddress";
import Gallery from "../components/Gallery";
import Links from "../components/Links";
import Button from "../components/Button";
import LoadingIndicator from "../components/LoadingIndicator";
import Nft from "../components/Nft";
import { pxgLib } from "../pxg-lib";

export const styles = {
  avatarCard: css`
    padding: 2.4rem;
    border-radius: 1.2rem;
    position: sticky;
    top: 1rem;
    border: 1px solid #dedede;
  `,
  editBar: css`
    display: flex;
    justify-content: flex-end;
    max-width: 124.8rem;
    margin-left: auto;
    margin-right: auto;
    padding: 2rem 1rem;
    a {
      color: #8c8c8c;
      font-weight: bold;
      font-size: 1.4rem;
      text-decoration: none;
    }
  `,
  loadingWrap: css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  `,
  forSale: css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    & p {
      color: #8c8c8c;
    }
  `,
};

const LIMIT = 20;

export default function Profile() {
  const context = React.useContext(Web3Context);
  const profile = React.useContext(ProfileContext);
  const {
    params: { name },
  } = useRouteMatch<{ name: string }>();

  const [nfts, updateNfts] = React.useState<any>(null);
  const [apiOffset, updateApiOffset] = React.useState(0);
  const [hideLoadMore, updateHideLoadMore] = React.useState(true);
  const [loading, updateLoading] = React.useState(false);

  async function getNfts(offset = apiOffset) {
    if (!profile.data?.owner) return;
    updateLoading(true);
    const res = await fetch(
      `https://api.opensea.io/api/v1/assets?order_direction=desc&offset=${offset}&limit=${LIMIT}&owner=${profile.data?.owner}`,
      {
        headers: {
          "X-API-KEY": "72fdb7cff7064b70807e0f32d4ec3fa3",
        },
      }
    ).then((res) => res.json());
    if (Array.isArray(res?.assets) && res.assets.length === 0) {
      updateHideLoadMore(true);
    } else {
      updateHideLoadMore(false);
    }
    const assets = res?.assets ?? [];
    updateNfts((c: any) => [...(c ?? []), ...assets]);
    updateLoading(false);
  }

  React.useEffect(() => {
    getNfts();
  }, [profile.data?.owner]);

  return (
    <>
      {context?.connected && (
        <>
          {context.accounts?.[0].toLowerCase() ===
            profile.data?.owner?.toLowerCase() && (
            <div css={styles.editBar}>
              <Link to={`/${name}/edit`}>Edit profile</Link>
            </div>
          )}
          <FloatWrap>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <div css={styles.avatarCard}>
                  <Avatar src={profile?.data?.avatar?.metadata?.image} />

                  {profile.data?.label && (
                    <Spacer t="1.2rem" b="1.2rem">
                      <P weight="700">{`${profile.data.label}.${pxgLib.constants.NODE}`}</P>
                    </Spacer>
                  )}
                  {profile.data?.owner && (
                    <a
                      href={`https://etherscan.io/address/${profile.data.owner}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <WalletAddress address={profile.data.owner} />
                    </a>
                  )}
                  <Links />
                </div>
              </Grid>
              <Grid item xs={9}>
                {profile.loading && (
                  <>
                    <div css={styles.loadingWrap}>
                      <LoadingIndicator />
                    </div>
                  </>
                )}

                {!profile.loading && (
                  <>
                    {!profile.data?.owner && (
                      <div css={styles.forSale}>
                        <P weight="bold">
                          This name may be available. You can register this name{" "}
                          <a href="">here</a>.
                        </P>
                      </div>
                    )}
                  </>
                )}

                <Gallery />
              </Grid>
            </Grid>
          </FloatWrap>
          <FloatWrap background="none">
            <Grid container spacing={2}>
              <Grid item xs={3}></Grid>
              <Grid item xs={9}>
                <Grid container spacing={2}>
                  {nfts &&
                    nfts.length > 0 &&
                    nfts.map((nft: any) => {
                      console.log(nft);
                      return (
                        <Grid item xs={4}>
                          <Link
                            to={`/${profile.data?.label}/${nft.asset_contract.address}/${nft.token_id}`}
                          >
                            <Nft nft={nft} />
                          </Link>
                        </Grid>
                      );
                    })}
                  {loading && (
                    <Grid item xs={4}>
                      <div
                        css={css(
                          styles.loadingWrap,
                          css`
                            min-height: 200px;
                          `
                        )}
                      >
                        <LoadingIndicator />
                      </div>
                    </Grid>
                  )}
                </Grid>
                <Spacer t="2rem">
                  {!hideLoadMore && (
                    <Button
                      disabled={loading}
                      onClick={() => {
                        const offset = apiOffset + 1;
                        updateApiOffset(offset);
                        getNfts(offset * LIMIT);
                      }}
                    >
                      Load more
                    </Button>
                  )}
                </Spacer>
              </Grid>
            </Grid>
          </FloatWrap>
        </>
      )}
    </>
  );
}
