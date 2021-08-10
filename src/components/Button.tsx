import { css } from "@emotion/react";
import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: (e: any) => any;
};

const styles = {
  root: css`
    padding: 1.8rem 3rem;
    background: black;
    color: white;
    border-radius: 5px;
    border: 0;
    font-size: 1.6rem;
  `,
};

function Button({ children, onClick }: ButtonProps) {
  return (
    <button onClick={onClick} css={styles.root}>
      {children}
    </button>
  );
}

export default Button;
