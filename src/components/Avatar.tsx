import { css } from "@emotion/react";
import React from "react";
import { normalizeIpfs } from "../pxg-lib";
import { Avatar as BlankAvatar } from "@material-ui/core";

type AvatarProps = {
  src?: string;
  w?: string;
  h?: string;
};

const styles = {
  root: (w: string = `5rem`, h: string = `5rem`) => css`
    width: ${w};
    height: ${h};
    overflow: hidden;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    & img {
      max-width: 100%;
      width: 100%;
      height: auto;
    }
  `,
};

function Avatar({ src, w, h }: AvatarProps) {
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
    <div css={styles.root()}>
      <img src={normalizeIpfs(src)} alt="Default Avatar" />
    </div>
  );
}

export default Avatar;
