import React from "react";
import { useRouteMatch } from "react-router-dom";
import FloatWrap from "../components/FloatWrap";
import { pxgLib } from "../pxg-lib";
import { Web3Context } from "../Web3Provider";
import Grid from "@material-ui/core/Grid";
import { css } from "@emotion/react";

const styles = {
  avatarCard: css`
    padding: 2.4rem;
    border-radius: 1.2rem;
    border: 1px solid #dedede;
  `,
};

export default function Profile() {
  const context = React.useContext(Web3Context);
  const match = useRouteMatch<{ name: string }>();
  React.useEffect(() => {
    if (context?.connected) {
      const getInfo = async () => {
        try {
          const owner = await pxgLib.ownerOfNode(match.params.name);
          console.log(owner);
        } catch (e) {
          if (e.message.includes("owner query for nonexistent token")) {
            // can register token
          } else {
            // maybe can register name
          }
          console.log("error", e.message);
        }
      };
      getInfo();
    }
  }, [context?.connected]);
  return (
    <>
      {context?.connected && (
        <>
          <FloatWrap>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <div css={styles.avatarCard}></div>
              </Grid>
              <Grid item xs={9}></Grid>
            </Grid>
          </FloatWrap>
        </>
      )}
    </>
  );
}
