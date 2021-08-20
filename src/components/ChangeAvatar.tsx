import { css } from "@emotion/react";
import { Grid } from "@material-ui/core";
import React, { useContext } from "react";
import web3Util from "../pxg-lib/web3.util";
import Button from "./Button";
import Heading from "./Heading";
import LoadingIndicator from "./LoadingIndicator";
import { ProfileContext } from "./ProfileContext";
import Select from "./Select";
import Spacer from "./Spacer";

const styles = {
  selectWrap: css`
    display: flex;
    justify-content: flex-end;
    position: relative;
    z-index: 10;
    & > div {
      flex: 1;
    }
  `,
  root: css`
    position: relative;
  `,
  loading: css`
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  headingWrap: css`
    display: flex;
    align-items: center;
    height: 100%;
  `,
  imageWrap: css`
    max-width: 7.4rem;
    width: 100%;
    height: auto;
    display: flex;
    border-radius: 200px;
    overflow: hidden;
    & img {
      width: 100%;
      height: auto;
    }
  `,
  paginate: css`
    display: flex;
    & button:first-child {
      margin-right: 1.6rem;
    }
  `,
};

/*
need to have a function which returns a list of nfts a user owns for the give collection
should be a paginated list 

so it should take a page number and will need to keep track of the last index
 
 */

const addresses = {
  pxg: "0xf38d6bf300d52ba7880b43cddb3f94ee3c6c4ea6",
  mooncats: "0xc3f733ca98e0dad0386979eb96fb1722a1a05e69",
  punks: "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb",
};

type ID = keyof typeof addresses;

const LIMIT = 20;

type Response = { assets: any[] };

type ResponseState = {
  prev?: Response;
  current: Response;
  next: Response;
} | null;

const useContractResults = (
  id: ID,
  offset: number
): { loading: boolean; results: ResponseState } => {
  const [results, updateResults] = React.useState<ResponseState>(null);
  const [loading, updateLoading] = React.useState(true);
  const context = useContext(ProfileContext);

  console.log(results);

  React.useEffect(() => {
    if (!context.data?.owner) return;
    updateLoading(true);
    const fn = async () => {
      const [current, next] = await Promise.all([
        fetch(
          `https://api.opensea.io/api/v1/assets?order_direction=desc&offset=${
            offset * LIMIT
          }&limit=${LIMIT}&owner=${
            context.data?.owner
          }&asset_contract_address=${addresses[id]}`,
          {
            headers: {
              "X-API-KEY": "72fdb7cff7064b70807e0f32d4ec3fa3",
            },
          }
        ).then((r) => r.json()),
        fetch(
          `https://api.opensea.io/api/v1/assets?order_direction=desc&offset=${
            (offset + 1) * LIMIT
          }&limit=${LIMIT}&owner=${
            context.data?.owner
          }&asset_contract_address=${addresses[id]}`,
          {
            headers: {
              "X-API-KEY": "72fdb7cff7064b70807e0f32d4ec3fa3",
            },
          }
        ).then((r) => r.json()),
      ]);
      updateLoading(false);
      updateResults({ current, next });
    };
    fn();
  }, [id, offset, context.data?.owner]);
  return { loading, results };
};

const options = [
  {
    id: "pxg",
    displayValue: "Pixelglyphs",
  },
  {
    id: "mooncats",
    displayValue: "Mooncats",
  },
  {
    id: "punks",
    displayValue: "CryptoPunks",
  },
];

export default function ChangeAvatar() {
  const [selectedOption, updateSelectedOption] = React.useState<ID>("pxg");
  const [offset, updateOffset] = React.useState(0);
  const { loading, results } = useContractResults(selectedOption, offset);
  const updatePage = (num: number) => () => {
    updateOffset(offset + num);
  };

  const hasNext =
    results &&
    results.next &&
    results.next.assets &&
    results.next.assets.length > 0;
  const hasPrev = offset > 0;

  return (
    <>
      <Grid container>
        <Grid item xs={3}>
          <div css={styles.headingWrap}>
            <Heading tag={6}>Change avatar</Heading>
          </div>
        </Grid>
        <Grid item xs={9}>
          <div css={styles.selectWrap}>
            <Select
              selected={selectedOption}
              onSelect={(id) => {
                if (id === selectedOption) return;
                updateOffset(0);
                updateSelectedOption(id as ID);
              }}
              options={options}
            />
          </div>
        </Grid>
      </Grid>
      <Spacer t="2.4rem">
        <div css={styles.root}>
          {loading && (
            <div css={styles.loading}>
              <LoadingIndicator />
            </div>
          )}
          <Grid container spacing={2}>
            {results && results.current.assets.length > 0 && (
              <>
                {results.current.assets.map((asset) => (
                  <Grid key={asset.token_id} item xs={3}>
                    <div css={styles.imageWrap}>
                      <img src={asset.image_url} />
                    </div>
                  </Grid>
                ))}
              </>
            )}
          </Grid>
          <Spacer t="2.4rem">
            <div css={styles.paginate}>
              <Button
                disabled={!hasPrev}
                onClick={updatePage(-1)}
                variant="round"
              >
                Prev
              </Button>

              <Button
                disabled={!hasNext}
                onClick={updatePage(1)}
                variant="round"
              >
                Next
              </Button>
            </div>
          </Spacer>
        </div>
      </Spacer>
    </>
  );
}
