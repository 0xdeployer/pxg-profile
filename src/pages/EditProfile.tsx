import { css } from "@emotion/react";
import { Grid } from "@material-ui/core";
import React from "react";
import { NavLink, useRouteMatch } from "react-router-dom";
import FloatWrap from "../components/FloatWrap";
import Heading from "../components/Heading";

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
      margin-bottom: 2.4rem;
    }
    & a.active {
      background: #ededed;
    }
  `,
};

export default function EditProfile() {
  const {
    params: { name },
  } = useRouteMatch<{ name: string }>();

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
  return (
    <FloatWrap>
      <Grid container>
        <Grid item xs={2}>
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
        <Grid item xs={10}>
          <Heading tag={5}>Account</Heading>
          <hr />
        </Grid>
      </Grid>
    </FloatWrap>
  );
}
