import { css } from "@emotion/react";
import React from "react";

type HeadingProps = {
  tag?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
};

const tags = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h2",
  6: "h3",
};

const styles = {
  1: css`
    font-weight: 700;
    font-size: 3.2rem;
    letter-spacing: -0.5px;
  `,
  2: css`
    font-weight: 400;
    font-size: 2.4rem;
    letter-spacing: -0.5px;
    color: #212121;
  `,
  3: css`
    color: #8c8c8c;
    font-size: 2rem;
    font-weight: 500;
    letter-spacing: -0.5px;
  `,
  4: css`
    font-size: 1.4rem;
    font-weight: bold;
    letter-spacing: -0.5px;
  `,
  5: css`
    font-size: 2rem;
    font-weight: bold;
  `,
  6: css`
    font-size: 1.6rem;
    font-weight: bold;
  `,
};

export default function Heading({ tag = 1, children }: HeadingProps) {
  const H = tags[tag];
  //@ts-ignore
  return <H css={styles[tag]}>{children}</H>;
}
