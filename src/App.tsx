import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { pxgLib } from "./pxg-lib";
import Profile from "./pages/Profile";
import { Route } from "react-router-dom";
import Button from "./components/Button";
import { css } from "@emotion/react";
import ProfileProvider from "./components/ProfileContext";

const styles = {
  connect: css`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5rem 2rem;
  `,
};

// @ts-ignore
window.pxgLib = pxgLib;

const LS_KEY = "__PXG_ENABLED__";

function App() {
  const [connectedAddress, updateConnectedAddress] = React.useState<
    string | undefined
  >();
  const [glyphs, updateGlyphs] = React.useState<any[]>([]);
  const [name, updateName] = React.useState("");
  const connect = () => {
    pxgLib.enable().then(() => {
      window.localStorage?.setItem(LS_KEY, "true");
      updateConnectedAddress(pxgLib?.accounts?.[0]);
      // check to see if gallery set.
      // if yes get gallery stuff.

      // get all info related to pxg path
      pxgLib.getGlyphs().then((glyphs) => {
        // @ts-ignore
        updateGlyphs(glyphs);
      });

      const fn = async () => {
        const balance = await pxgLib.balanceOf();
        const token = await pxgLib.tokenOfOwnerByIndex(0);
      };
    });
  };

  React.useEffect(() => {
    if (window.localStorage?.getItem(LS_KEY) === "true" && pxgLib.hasProvider) {
      connect();
    }
  }, []);

  const claim = () => {
    pxgLib.claimFromGlyph("1", name);
  };

  if (!connectedAddress) {
    return (
      <div css={styles.connect}>
        <Button onClick={connect}>Connect Wallet</Button>
      </div>
    );
  }

  return (
    <>
      <Route path="/:name" exact>
        <ProfileProvider>
          <Profile />
        </ProfileProvider>
      </Route>
      <div style={{ padding: "10px" }}>
        {connectedAddress && <div>{connectedAddress}</div>}
        <input
          value={name}
          onChange={(e) => {
            updateName(e.target.value);
          }}
        />

        <button onClick={claim}>Claim</button>
        <button onClick={connect}>Connect</button>
        <hr />
        {glyphs &&
          glyphs.length > 0 &&
          glyphs.map((g) => (
            <div key={g.name}>
              {g.name} - ID: {g.tokenId}
            </div>
          ))}
        <hr />
      </div>
    </>
  );
}

export default App;
