import React from "react";
import "./App.css";
import { pxgLib } from "./pxg-lib";
import Profile from "./pages/Profile";
import { Route, Switch } from "react-router-dom";
import ProfileProvider from "./components/ProfileContext";
import NftDetail from "./pages/NftDetail";
import EditProfile from "./pages/EditProfile";
import RootPath from "./pages/RootPath";

// @ts-ignore
window.pxgLib = pxgLib;

const LS_KEY = "__PXG_ENABLED__";

function App() {
  const [connectedAddress, updateConnectedAddress] = React.useState<
    string | undefined
  >();
  const connect = () => {
    pxgLib.enable().then(() => {
      window.localStorage?.setItem(LS_KEY, "true");
      updateConnectedAddress(pxgLib?.accounts?.[0]);
    });
  };

  React.useEffect(() => {
    if (window.localStorage?.getItem(LS_KEY) === "true" && pxgLib.hasProvider) {
      connect();
    }
  }, []);

  return (
    <>
      <Route path="/" exact>
        <RootPath />
      </Route>

      <>
        <Route path="/:name">
          <ProfileProvider>
            <Switch>
              <Route path="/:name" exact>
                <Profile connect={connect} />
              </Route>

              {pxgLib.hasProvider && connectedAddress && (
                <Route path="/:name/edit">
                  <EditProfile />
                </Route>
              )}

              <Route path="/:name/:address/:tokenId" exact>
                <NftDetail />
              </Route>
            </Switch>
          </ProfileProvider>
        </Route>
      </>
    </>
  );
}

export default App;
