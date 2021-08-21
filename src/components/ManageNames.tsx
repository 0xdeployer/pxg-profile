import { css } from "@emotion/react";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { pxgLib } from "../pxg-lib";
import Checkmark from "./Checkmark";
import Heading from "./Heading";
import P from "./P";
import { ProfileContext } from "./ProfileContext";
import Spacer from "./Spacer";

const styles = {
  headingWrap: css`
    height: 3.7rem;
    display: flex;
    align-items: center;
  `,
  domainBox: css`
    border-radius: 1.2rem;
    border: 1px solid #dedede;
    padding: 2.4rem 1.6rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,
};

export default function ManageNames() {
  const profile = useContext(ProfileContext);
  const [inWallet, updateInWallet] = React.useState<
    { tokenId: any; label: string; name: string }[]
  >([]);

  React.useEffect(() => {
    const fn = async () => {
      const contract = pxgLib.getContract("registrar");
      if (!contract) return;
      const balance = await contract.methods
        .balanceOf(pxgLib.accounts?.[0])
        .call();

      let tokens = [];

      for (let i = 0; i < parseInt(balance); i++) {
        tokens.push(pxgLib.tokenOfOwnerByIndex(i));
      }
      tokens = await Promise.all(tokens);
      tokens = tokens.filter(({ name }) => name !== profile?.data?.label);
      updateInWallet(tokens);
    };
    fn();
  }, [profile?.data?.label]);

  return (
    <div>
      <div css={styles.headingWrap}>
        <Heading tag={6}>Your Domain</Heading>
      </div>

      <Spacer t="1.6rem">
        <div css={styles.domainBox}>
          <P weight="bold">{`${profile.data?.label}.pxg.eth`}</P>
          <Checkmark />
        </div>
      </Spacer>

      {inWallet.length > 0 && (
        <Spacer t="3.2rem">
          <Heading tag={6}>In wallet</Heading>
          {inWallet.map(({ name, label }) => {
            return (
              <Spacer t="1.6rem">
                <div css={styles.domainBox}>
                  <P weight="bold">{label}</P>
                  <a href={`/${name}/edit`}>
                    <P
                      weight="bold"
                      styles={{
                        root: css`
                          color: #8c8c8c;
                        `,
                      }}
                    >
                      Manage
                    </P>
                  </a>
                </div>
              </Spacer>
            );
          })}
        </Spacer>
      )}
    </div>
  );
}
