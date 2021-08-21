import { Grid } from "@material-ui/core";
import React from "react";
import ChangeAvatar from "../../components/ChangeAvatar";
import ManageNames from "../../components/ManageNames";

export default function Account() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <ChangeAvatar />
      </Grid>
      <Grid item xs={6}>
        <ManageNames />
      </Grid>
    </Grid>
  );
}
