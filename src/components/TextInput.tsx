import { css } from "@emotion/react";
import React from "react";

type TextInputProps = {
  name: string;
  label: string;
  placeholder: string;
  value?: string;
  onChange: any;
};

const styles = {
  label: css`
    display: block;
    font-size: 1.4rem;
    margin-bottom: 0.8rem;
  `,
  input: css`
    background: #ededed;
    border: 1px solid #ededed;
    border-radius: 100px;
    font-family: Inter;
    width: 100%;
    border: 2px solid #ededed;

    padding: 1rem 1.6rem;

    &:focus {
      outline: none;
      border: 2px solid blue;
    }
  `,
};

export default function TextInput({
  label,
  placeholder,
  name,
  value,
  onChange,
}: TextInputProps) {
  return (
    <div>
      <label css={styles.label} htmlFor={name}>
        {label}
      </label>
      <input
        css={styles.input}
        type="text"
        placeholder={placeholder}
        onChange={(e: any) => {
          onChange(name, e.target.value);
        }}
        name={name}
        value={value}
      />
    </div>
  );
}
