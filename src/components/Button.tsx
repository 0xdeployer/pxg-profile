import { css } from "@emotion/react";
import React from "react";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: (e: any) => any;
  variant?: "default" | "round" | "roundAlt";
  arrowRight?: true;
  arrowLeft?: true;
  disabled?: boolean;
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
  round: css`
    border: 1px solid #dedede;
    border-radius: 10rem;
    display: flex;
    justify-content: center;
    background: white;
    padding: 1.2rem 1.6rem;
    align-items: center;
    font-weight: bold;
  `,

  icon: css`
    & svg {
      height: 100%;
      width: 100%;
    }
    width: 1.6rem;
    height: 1.6rem;
  `,
};

const variants = {
  default: styles.root,
  round: styles.round,
  roundAlt: css(styles.round, "background: #DEDEDD"),
};

function Button({
  children,
  onClick,
  variant = "default",
  arrowRight,
  disabled,
  arrowLeft,
}: ButtonProps) {
  return (
    <button disabled={disabled} onClick={onClick} css={variants[variant]}>
      {arrowLeft && (
        <div css={css(styles.icon, `margin-right: 1rem;`)}>
          <ArrowBackIcon />
        </div>
      )}
      {children}
      {arrowRight && (
        <div css={css(styles.icon, `margin-left: 1rem;`)}>
          <ArrowForwardIcon />
        </div>
      )}
    </button>
  );
}

export default Button;
