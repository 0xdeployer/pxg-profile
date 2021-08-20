import { css, keyframes } from "@emotion/react";
import React from "react";
import P from "./P";

const animation = keyframes`
  from {
    transform: scale(0.75);
  }
  to {
    transform: scale(1);
  }
`;

const styles = {
  animate: css`
    animation: ${animation} infinite alternate 0.5s linear;
    width: 35px;
    height: 35px;
    background: #3d3d3d;
    border-radius: 50px;
  `,
  wrap: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  `,
  p: css`
    font-size: 1rem;
  `,
};

export default function LoadingIndicator() {
  return (
    <>
      <div css={styles.wrap}>
        <div css={styles.animate} />
        <P styles={{ root: styles.p }}>Loading</P>
      </div>
    </>
  );
}
