import { css, SerializedStyles } from "@emotion/react";
import React from "react";

const styles = {
  root: (
    t: string,
    r: string,
    b: string,
    l: string,
    styles?: SerializedStyles
  ) =>
    css(
      `
    margin-top: ${t};
    margin-left: ${l};
    margin-right: ${r};
    margin-bottom: ${b};
  `,
      styles
    ),
};

type SpacerProps = {
  t?: string;
  r?: string;
  b?: string;
  l?: string;
  children?: React.ReactNode;
  styles?: {
    root?: SerializedStyles;
  };
};

function Spacer({
  t = "0",
  r = "0",
  b = "0",
  l = "0",
  children,
  styles: _styles,
}: SpacerProps) {
  return <div css={styles.root(t, r, b, l, _styles?.root)}>{children}</div>;
}

export default Spacer;
