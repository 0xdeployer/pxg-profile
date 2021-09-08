import { css } from "@emotion/react";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { pxgLib } from "../pxg-lib";
import Button from "./Button";
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

  const [ens, updateEns] = React.useState(null);
  const [reverseRecord, updateReverseRecord] = React.useState<null | string>(
    null
  );
  React.useEffect(() => {
    const fn = async () => {
      try {
        // @ts-ignore
        const _ens = await import("@ensdomains/ensjs");
        const ens = new _ens.default({
          provider: pxgLib.provider,
          ensAddress: _ens.getEnsAddress("1"),
        });

        console.log(_ens);
        updateEns(ens);

        const { name } = await ens.getName(pxgLib?.accounts?.[0]);
        updateReverseRecord(name);
      } catch (e) {
        console.error("Error using ensjs library", e.message);
      }
    };

    fn();
  }, []);

  const name = `${profile.data?.label}.${pxgLib.constants.NODE}`;
  const reverseSetToCurrentName =
    reverseRecord && reverseRecord.toLowerCase() === name.toLowerCase();

  return (
    <div>
      <div css={styles.headingWrap}>
        <Heading tag={6}>Your Domain</Heading>
      </div>

      <Spacer t="1.6rem">
        <div css={styles.domainBox}>
          <P weight="bold">{name}</P>
          <Checkmark />
        </div>
      </Spacer>

      {ens && (
        <>
          {reverseSetToCurrentName && (
            <Spacer t="1.6rem">
              <P
                styles={{
                  root: css`
                    color: #2d2d2d;
                  `,
                }}
              >
                Reverse ENS record set to {name}
              </P>
            </Spacer>
          )}
          <Spacer t="1.6rem">
            <Button
              disabled={!!reverseSetToCurrentName}
              variant="round"
              onClick={() => {
                console.log(name);
                // @ts-ignore
                ens?.setReverseRecord(name);
              }}
            >
              Set reverse record
            </Button>
          </Spacer>
        </>
      )}

      {inWallet.length > 0 && (
        <Spacer t="3.2rem">
          <Heading tag={6}>In wallet</Heading>
          {inWallet.map(({ name, label }) => {
            return (
              <Spacer key={name} t="1.6rem">
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
