import { css } from "@emotion/react";
import React from "react";

const styles = {
  root: css`
    background: #fff;
    width: 100%;
    max-width: 124.8rem;
    margin-left: auto;
    margin-right: auto;
    padding: 4.8rem;
    border-radius: 1.2rem;
  `,
};

type FloatWrapProps = {
  children: React.ReactNode;
};

function FloatWrap({ children }: FloatWrapProps) {
  return <div css={styles.root}></div>;
}

export default FloatWrap;
