import { css } from "@emotion/react";
import React, { SyntheticEvent, useMemo } from "react";
import P from "./P";

type OptionType = {
  id: string;
  displayValue: string;
};

type SelectProps = {
  options: OptionType[];
  selected: string;
  onSelect: (id: string) => any;
};

const height = 3.7;
const heightString = `${3.7}rem`;

const styles = {
  selectRoot: css`
    display: none;
  `,
  wrap: css`
    border: 1px solid #c4c4c4;
    border-radius: 100px;
    max-width: 24rem;
    height: ${heightString};
    display: flex;
    position: relative;
    padding: 0 1.6rem;

    align-items: center;
  `,
  option: css`
    color: #8c8c8c;
    height: ${heightString};
    display: flex;
    align-items: center;
    overflow: hidden;
    cursor: pointer;
  `,
  arrow: css`
    width: 12px;
    height: 7px;
    position: absolute;
    right: 1.6rem;
  `,
  optionsWrap: css`
    width: 100%;
    height: ${heightString};
    overflow: hidden;
    align-self: baseline;
  `,
  active: (len: number) => css`
    overflow: scroll;
    height: ${3.7 * 3 + len * 0.1}rem;
    & [data-id="option"]:not(:first-child) {
      border-bottom: 1px solid #c4c4c4;
      background: white;
    }
  `,
};

export default function Select({ options, selected, onSelect }: SelectProps) {
  const [active, updateActive] = React.useState(false);

  const onClick = (e: SyntheticEvent<HTMLDivElement>) => {
    if (!active) {
      updateActive(!active);
    } else {
      let id;
      let current = e.target;
      while (current) {
        // @ts-ignore
        let parent = current.parentElement;
        if (parent && parent.dataset.option) {
          id = parent.dataset.option;
          break;
        }
        current = parent;
      }

      if (!id) return;

      onSelect(id as string);
      updateActive(false);
    }
  };

  const { selectedOption, rest } = useMemo(() => {
    const selectedOption = options.find((opt) => opt.id === selected);
    const rest = options.filter((opt) => opt.id !== selected);
    return { selectedOption, rest };
  }, [selected, options]);
  return (
    <div css={styles.wrap} onClick={onClick}>
      <select css={styles.selectRoot}>
        {options.map(({ id, displayValue }) => {
          return <option value={id}>{displayValue}</option>;
        })}
      </select>
      <div
        css={css(
          styles.optionsWrap,
          active ? styles.active(options.length) : null
        )}
      >
        <div data-id="option" data-option={selectedOption?.id}>
          <P styles={{ root: styles.option }}>{selectedOption?.displayValue}</P>
        </div>
        {rest.map(({ id, displayValue }) => {
          return (
            <div data-id="option" data-option={id}>
              <P styles={{ root: styles.option }}>{displayValue}</P>
            </div>
          );
        })}
      </div>
      <div css={styles.arrow}>
        <svg
          width="12"
          height="7"
          viewBox="0 0 12 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 1L6 6L11 1" stroke="#8C8C8C" />
        </svg>
      </div>
    </div>
  );
}