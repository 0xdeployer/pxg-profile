import React from "react";
import { useRouteMatch } from "react-router-dom";
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

const styles = {
  avatarCard: css`
    padding: 2.4rem;
    border-radius: 1.2rem;
    border: 1px solid #dedede;
  `,
};

export default function Profile() {
  const context = React.useContext(Web3Context);
  const profile = React.useContext(ProfileContext);
  const match = useRouteMatch<{ name: string }>();
  console.log(profile);
  return (
    <>
      {context?.connected && (
        <>
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
