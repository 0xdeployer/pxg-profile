import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import FloatWrap from "../components/FloatWrap";
import { pxgLib } from "../pxg-lib";
import { Web3Context } from "../Web3Provider";
import Grid from "@material-ui/core/Grid";
import { css } from "@emotion/react";
import { ProfileContext } from "../components/ProfileContext";
import Avatar from "../components/Avatar";

import P from "../components/P";
import Spacer from "../components/Spacer";
import WalletAddress from "../components/WalletAddress";
import Gallery from "../components/Gallery";

export const styles = {
  avatarCard: css`
    padding: 2.4rem;
    border-radius: 1.2rem;
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
};

export default function Profile() {
  const context = React.useContext(Web3Context);
  const profile = React.useContext(ProfileContext);
  const {
    params: { name },
  } = useRouteMatch<{ name: string }>();
  console.log(profile);
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
                      <P weight="700">{`${profile.data.label}.pxg.eth`}</P>
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
                </div>
              </Grid>
              <Grid item xs={9}>
                <Gallery />
              </Grid>
            </Grid>
          </FloatWrap>
        </>
      )}
    </>
  );
}
