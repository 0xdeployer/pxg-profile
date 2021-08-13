import { css } from "@emotion/react";
import { Grid } from "@material-ui/core";
import React from "react";
import Heading from "../../components/Heading";
import P from "../../components/P";
import { ProfileContext } from "../../components/ProfileContext";
import Spacer from "../../components/Spacer";
import { pxgLib } from "../../pxg-lib";
import { EditCommon } from "../EditProfile";

type GalleryProps = EditCommon;

const styles = {
  galleryItem: (bg?: string, active?: boolean) => css`
    height: 250px;
    border-radius: 1.8rem;
    border: ${active ? "2px solid rgb(184, 4, 247)" : "1px solid #888"};
    background: ${bg ? `url(${bg})` : "none"};
    background-size: cover;
    overflow: hidden;
    padding: 1rem;
    display: flex;
    align-items: flex-end;
    box-shadow: inset 0 -45px 0px rgba(0, 0, 0, 0.5);
    & h2 {
      color: white;
      text-shadow: 0px 0px 2px #000;
    }
  `,
};

export default function Gallery({ updateTitle }: GalleryProps) {
  const profile = React.useContext(ProfileContext);
  const { allGalleries } = profile;
  const hasGalleries = allGalleries && allGalleries.length > 0;
  console.log(allGalleries);
  React.useEffect(() => {
    updateTitle("NFT Gallery");
  }, []);
  return (
    <div>
      <Spacer b="2.4rem">
        <P>
          Add, or edit galleries on{" "}
          <a target="_blank" rel="noreferrer" href="https://oncyber.io">
            Cyber
          </a>
          . Your Cyber galleries will show up here.
        </P>
      </Spacer>
      {hasGalleries && (
        <>
          <Grid container spacing={2}>
            {allGalleries?.map((gallery) => {
              const active = profile.exhibitId === gallery.id;
              return (
                <Grid item xs={4}>
                  <div
                    onClick={async () => {
                      if (active) return;
                      try {
                        await pxgLib.setDefaultGallery(gallery.id);
                        profile.getGallery(profile.data?.owner);
                      } catch (e) {}
                    }}
                    css={styles.galleryItem(gallery.info.heroImg, active)}
                  >
                    <Heading tag={5}>{gallery.info.headline}</Heading>
                  </div>
                </Grid>
              );
            })}
          </Grid>
        </>
      )}
    </div>
  );
}
