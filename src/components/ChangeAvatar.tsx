import { css } from "@emotion/react";
import { Grid } from "@material-ui/core";
import React, { useContext } from "react";
import { pxgLib } from "../pxg-lib";
import web3Util from "../pxg-lib/web3.util";
import Button from "./Button";
import Checkmark from "./Checkmark";
import Heading from "./Heading";
import LoadingIndicator from "./LoadingIndicator";
import P from "./P";
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
    z-index: 12;
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
    position: relative;
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
  avatarWrap: css`
    max-width: 7.4rem;
    width: 100%;
    height: auto;
    position: relative;
  `,
  activeBadge: css`
    width: 100%;
    height: 100%;
    border-radius: 200px;
    border: 4px solid #1b63f0;
    position: absolute;
    top: 0;
    left: 0;
  `,
  activeCheckmark: css`
    width: 2.4rem;
    top: 0;
    right: 0;
    height: 2.4rem;
    position: absolute;
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
  coolcats: "0x1a92f7381b9f03921564a437210bb9396471050c",
  guttercats: "0xedb61f74b0d09b2558f1eeb79b247c1f363ae452",
  bayc: "0x495f947276749ce646f68ac8c248420045cb7b5e",
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

  React.useEffect(() => {
    if (!context.data?.owner) return;
    updateLoading(true);
    const fn = async () => {
      const [current, next] = await Promise.all([
        fetch(
          `https://api.opensea.io/api/v1/assets?order_direction=asc&offset=${
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
          `https://api.opensea.io/api/v1/assets?order_direction=asc&offset=${
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
    link: "https://opensea.io/collection/pixelglyphs",
  },
  {
    id: "mooncats",
    displayValue: "Mooncats",
    link: "https://opensea.io/collection/acclimatedmooncats",
  },

  {
    id: "punks",
    displayValue: "CryptoPunks",
    link: "https://opensea.io/collection/cryptopunks",
  },
  {
    id: "bayc",
    displayValue: "Bored Ape Yacht Club",
    link: "https://opensea.io/collection/boredapeyachtclub",
  },
  {
    id: "coolcats",
    displayValue: "Cool cats",
    link: "https://opensea.io/collection/cool-cats-nft",
  },
  {
    id: "guttercats",
    displayValue: "Gutter Cat Gang",
    link: "https://opensea.io/collection/guttercatgang",
  },
];

export default function ChangeAvatar() {
  const profile = useContext(ProfileContext);
  const [selectedOption, updateSelectedOption] = React.useState<ID>("pxg");
  const currentOption = options.find((opt) => opt.id === selectedOption);
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
                {results.current.assets.map((asset) => {
                  const address = addresses[selectedOption];
                  const active =
                    address.toLowerCase() ===
                      profile.data?.avatar?.address?.toLowerCase() &&
                    asset.token_id == profile.data?.avatar?.tokenId;
                  const label = profile.data?.label;
                  return (
                    <Grid key={asset.token_id} item xs={3}>
                      <div
                        onClick={() => {
                          pxgLib.setDefaultAvatar(
                            label as string,
                            address,
                            asset.token_id
                          );
                        }}
                        css={styles.avatarWrap}
                      >
                        <div css={styles.imageWrap}>
                          <img src={asset.image_url} />
                        </div>
                        {active && <div css={styles.activeBadge}></div>}
                        {active && (
                          <div css={styles.activeCheckmark}>
                            <Checkmark />
                          </div>
                        )}
                      </div>
                    </Grid>
                  );
                })}
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
      <hr />
      <a
        css={css`
          text-decoration: none;
        `}
        target="_blank"
        href={currentOption?.link}
        rel="noreferrer"
      >
        <Button arrowRight variant="round">
          {currentOption?.displayValue} on OpenSea
        </Button>
      </a>
      <Spacer t="2rem">
        <P
          styles={{
            root: css`
              font-size: 1rem;
              color: #888;
            `,
          }}
        >
          Data provided by OpenSea
        </P>
      </Spacer>
    </>
  );
}
