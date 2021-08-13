import { css } from "@emotion/react";
import { Grid } from "@material-ui/core";
import React from "react";
import Heading from "../../components/Heading";
import Spacer from "../../components/Spacer";
import TextInput from "../../components/TextInput";
import { EditCommon } from "../EditProfile";

type LinksProps = EditCommon;

const styles = {
  inputWrap: css`
    & > div {
      margin-bottom: 1.6rem;
    }
  `,
};

export default function Links({ updateTitle }: LinksProps) {
  React.useEffect(() => {
    updateTitle("Profile links");
  }, []);
  const [values, updateValues] = React.useState({
    opensea: "",
    makersplace: "",
    knownorigin: "",
    foundation: "",
    rarible: "",
    superrare: "",
    mintable: "",
    cargo: "",

    twitter: "",
    instagram: "",
    discord: "",
    telegram: "",
  });

  const onChange = (name: any, value: any) => {
    updateValues((v) => ({
      ...v,
      [name]: value,
    }));
  };
  return (
    <>
      <Spacer b="2.4rem">
        <Heading tag={6}>Collections</Heading>
      </Spacer>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <div css={styles.inputWrap}>
            <TextInput
              name="opensea"
              label="OpenSea"
              value={values.opensea}
              placeholder="opensea.io/accounts/"
              onChange={onChange}
            />
            <TextInput
              name="knownorigin"
              label="KnownOrigin"
              value={values.knownorigin}
              placeholder="knownorigin.io/"
              onChange={onChange}
            />
            <TextInput
              name="makersplace"
              label="MakersPlace"
              value={values.makersplace}
              placeholder="makersplace.com/"
              onChange={onChange}
            />
            <TextInput
              name="superrare"
              label="SuperRare"
              value={values.superrare}
              placeholder="superrare.co/"
              onChange={onChange}
            />
          </div>
        </Grid>
        <Grid item xs={6}>
          <div css={styles.inputWrap}>
            <TextInput
              name="cargo"
              label="Cargo"
              value={values.cargo}
              placeholder="app.cargo.build/"
              onChange={onChange}
            />
            <TextInput
              name="rarible"
              label="Rarible"
              value={values.rarible}
              placeholder="rarible.com/"
              onChange={onChange}
            />
            <TextInput
              name="foundation"
              label="Foundation"
              value={values.foundation}
              placeholder="foundation.app/"
              onChange={onChange}
            />
          </div>
        </Grid>
      </Grid>
      <hr />
      <Spacer b="2.4rem">
        <Heading tag={6}>Social</Heading>
      </Spacer>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <div css={styles.inputWrap}>
            <TextInput
              name="twitter"
              label="Twitter"
              value={values.twitter}
              placeholder="twitter.com/"
              onChange={onChange}
            />
            <TextInput
              name="instagram"
              label="Instagram"
              value={values.instagram}
              placeholder="instagram.com/"
              onChange={onChange}
            />
          </div>
        </Grid>
        <Grid item xs={6}>
          <div css={styles.inputWrap}>
            <TextInput
              name="discord"
              label="Discord"
              value={values.discord}
              placeholder="discord.com/"
              onChange={onChange}
            />
            <TextInput
              name="telegram"
              label="Telegram"
              value={values.telegram}
              placeholder="t.co/"
              onChange={onChange}
            />
          </div>
        </Grid>
      </Grid>
    </>
  );
}
