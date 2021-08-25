import React from "react";
import "./App.css";
import { pxgLib } from "./pxg-lib";
import Profile from "./pages/Profile";
import { Route, Switch } from "react-router-dom";
import Button from "./components/Button";
import { css } from "@emotion/react";
import ProfileProvider from "./components/ProfileContext";
import NftDetail from "./pages/NftDetail";
import EditProfile from "./pages/EditProfile";
import P from "./components/P";
import RootPath from "./pages/RootPath";

const styles = {
  connect: css`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5rem 2rem;
  `,
  metamask: css`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    height: 100%;
    & p {
      color: #8c8c8c;
    }
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

  if (!connectedAddress && pxgLib.hasProvider) {
    return (
      <div css={styles.connect}>
        <Button onClick={connect}>Connect Wallet</Button>
      </div>
    );
  }

  if (!connectedAddress && !pxgLib.hasProvider) {
    return (
      <div css={styles.metamask}>
        <P weight="bold">
          You will need to{" "}
          <a href="https://metamask.io" target="_blank" rel="noreferrer">
            download Metamask
          </a>{" "}
          to interact with this site.
        </P>
      </div>
    );
  }

  return (
    <>
      <Route path="/" exact>
        <RootPath />
      </Route>
      <Route path="/:name">
        <ProfileProvider>
          <Switch>
            <Route path="/:name" exact>
              <Profile />
            </Route>
            <Route path="/:name/edit">
              <EditProfile />
            </Route>
            <Route path="/:name/:address/:tokenId" exact>
              <NftDetail />
            </Route>
          </Switch>
        </ProfileProvider>
      </Route>
    </>
  );
}

export default App;
