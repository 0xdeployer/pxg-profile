import { css } from "@emotion/react";
import { Grid } from "@material-ui/core";
import React, { useContext } from "react";
import Button from "../../components/Button";
import Heading from "../../components/Heading";
import P from "../../components/P";
import { ProfileContext } from "../../components/ProfileContext";
import Spacer from "../../components/Spacer";
import TextInput from "../../components/TextInput";
import { pxgLib } from "../../pxg-lib";
import { EditCommon } from "../EditProfile";

type LinksProps = EditCommon;

const styles = {
  inputWrap: css`
    & > div {
      margin-bottom: 1.6rem;
    }
  `,
};

const initialLinkState = {
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
  website: "",
};

export default function Links({ updateTitle }: LinksProps) {
  const profile = useContext(ProfileContext);
  const [values, updateValues] = React.useState(initialLinkState);

  const [loading, updateLoading] = React.useState(false);
  const [success, updateSuccess] = React.useState(false);
  const [error, updateError] = React.useState(false);
  React.useEffect(() => {
    updateTitle("Profile links");
    const fn = async () => {
      if (!profile?.data?.label) return;
      const { links } = await pxgLib.getLinks(profile?.data?.label);
      const current = links.reduce((a: any, link: any) => {
        a[link.key] = link.value;
        return a;
      }, {});
      updateValues({
        ...initialLinkState,
        ...current,
      });
    };
    fn();
  }, [profile?.data?.owner]);

  const onChange = (name: any, value: any) => {
    updateValues((v) => ({
      ...v,
      [name]: value,
    }));
  };

  const save = async () => {
    if (error) {
      updateError(false);
    }
    updateLoading(true);
    try {
      await pxgLib.setLinks(profile.data?.label as string, values);
      updateSuccess(true);
      setTimeout(() => {
        updateSuccess(false);
      }, 10000);
    } catch (e) {
      console.log(e);
      updateError(true);
    }
    updateLoading(false);
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
            <TextInput
              name="website"
              label="Personal Website"
              value={values.website}
              placeholder="you.com"
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
      <hr />
      <Button disabled={loading} onClick={save} variant="round">
        {loading ? "Please wait" : "Save all changes"}
      </Button>
      {success && (
        <Spacer t="2.4rem">
          <P>Your changes have been saved!</P>
        </Spacer>
      )}
    </>
  );
}
