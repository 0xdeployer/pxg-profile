import { css } from "@emotion/react";
import React, { useContext } from "react";
import { normalizeIpfs } from "pxg-js";
import { Avatar as BlankAvatar } from "@material-ui/core";
import { ProfileContext } from "./ProfileContext";
import { pxgLib } from "../pxg-lib";

type AvatarProps = {
  src?: string;
  w?: string;
  h?: string;
};

const styles = {
  root: (w = `5rem`, h = `5rem`, isPunk?: boolean) => css`
    width: ${w};
    height: ${h};
    overflow: hidden;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #ededed;
    & img {
      max-width: 100%;
      width: 100%;
      height: auto;
      ${isPunk ? `image-rendering: pixelated;` : ""}
    }
  `,
};

function Avatar({ src }: AvatarProps) {
  const context = useContext(ProfileContext);

  if (!src)
    return (
      <BlankAvatar
        css={css`
          width: 5rem !important;
          height: 5rem !important;
        `}
      />
    );

  return (
    <div
      css={styles.root(
        "5rem",
        "5rem",
        context.data?.avatar?.address?.toLowerCase() ===
          pxgLib.constants.PUNK_ADDRESS.toLowerCase()
      )}
    >
      <img src={normalizeIpfs(src)} alt="Default Avatar" />
    </div>
  );
}

export default Avatar;
