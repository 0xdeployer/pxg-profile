import React from "react";
import { css, SerializedStyles } from "@emotion/react";

const styles = {
  root: (weight = "normal", style?: SerializedStyles) =>
    css(
      `
    font-weight: ${weight};
    font-size: 1.6rem;
  `,
      style
    ),
};

type PProps = {
  children: React.ReactNode;
  weight?: string;
  styles?: {
    root?: SerializedStyles;
  };
};

function P({ children, weight, styles: _styles }: PProps) {
  return <p css={styles.root(weight, _styles?.root)}>{children}</p>;
}

export default P;
