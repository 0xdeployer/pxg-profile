import { css } from "@emotion/react";
import { Grid } from "@material-ui/core";
import React, { useContext } from "react";
import {
  Link,
  NavLink,
  Redirect,
  Route,
  useRouteMatch,
} from "react-router-dom";
import FloatWrap from "../components/FloatWrap";
import Heading from "../components/Heading";
import { ProfileContext } from "../components/ProfileContext";
import { pxgLib } from "../pxg-lib";
import Account from "./account/Account";
import Gallery from "./account/Gallery";
import Links from "./account/Links";
import { styles as profileStyles } from "./Profile";

const { editBar } = profileStyles;

const styles = {
  links: css`
    & a {
      border: 1px solid #ededed;
      border-radius: 100px;
      padding: 0.6rem 1.6rem;
      font-size: 1.3rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      color: inherit;
      font-weight: bold;
      margin-bottom: 1.8rem;
    }
    & a.active {
      background: #ededed;
    }
  `,
};

export type EditCommon = {
  updateTitle: React.Dispatch<React.SetStateAction<string>>;
};

export default function EditProfile() {
  const {
    params: { name },
  } = useRouteMatch<{ name: string }>();

  const profile = useContext(ProfileContext);

  const [title, updateTitle] = React.useState("Account");

  const links = [
    {
      name: "Account",
      path: `/${name}/edit`,
    },
    {
      name: "Gallery",
      path: `/${name}/edit/gallery`,
    },
    {
      name: "Links",
      path: `/${name}/edit/links`,
    },
  ];
  if (
    profile?.data?.owner?.toLowerCase() !== pxgLib.accounts?.[0]?.toLowerCase()
  ) {
    return <Redirect to={`/${name}`} />;
  }
  return (
    <>
      <div css={editBar}>
        <Link to={`/${name}`}>Back to gallery</Link>
      </div>
      <FloatWrap>
        <Grid container>
          <Grid item xs={12} sm={2}>
            <Heading tag={5}>Settings</Heading>
            <hr />
            <div css={styles.links}>
              {links.map((item) => (
                <div>
                  <NavLink exact to={item.path}>
                    {item.name}
                  </NavLink>
                </div>
              ))}
            </div>
          </Grid>
          <Grid item xs={12} sm={10}>
            <Heading tag={5}>{title}</Heading>
            <hr />
            <Route path="/:name/edit" exact>
              <Account />
            </Route>
            <Route path="/:name/edit/gallery">
              <Gallery updateTitle={updateTitle} />
            </Route>
            <Route path="/:name/edit/links">
              <Links updateTitle={updateTitle} />
            </Route>
          </Grid>
        </Grid>
      </FloatWrap>
    </>
  );
}
