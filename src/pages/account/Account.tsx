import { Grid } from "@material-ui/core";
import React from "react";
import ChangeAvatar from "../../components/ChangeAvatar";

export default function Account() {
  return (
    <Grid container>
      <Grid item xs={6}>
        <ChangeAvatar />
      </Grid>
      <Grid item xs={6}></Grid>
    </Grid>
  );
}
