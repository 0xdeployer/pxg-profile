import { css } from "@emotion/react";
import React, { useContext } from "react";
import Button from "./Button";
import Heading from "./Heading";
import { LinkType, ProfileContext } from "./ProfileContext";
import Spacer from "./Spacer";

const labels: any = {
  opensea: "OpenSea",
  makersplace: "Makersplace",
  knownorigin: "KnownOrigin",
  foundation: "Foundation",
  rarible: "Rarible",
  superrare: "SuperRare",
  cargo: "Cargo",

  twitter: "Twitter",
  instagram: "Instagram",
  discord: "Discord",
  telegram: "Telegram",
  website: "Personal Site",
};

const Link = (props: { item: LinkType }) => (
  <a
    css={css`
      text-decoration: none;
    `}
    href={props.item.value}
    target="_blank"
    rel="noreferrer"
  >
    <Button variant="round" arrowRight>
      {labels[props.item.key]}
    </Button>
  </a>
);

export default function Links() {
  const profile = useContext(ProfileContext);

  const collections = profile?.links?.filter(
    (item) => item.category === "collection"
  );

  const socials = profile?.links?.filter((item) => item.category === "social");

  return profile.links && profile.links.length ? (
    <>
      {collections && collections.length > 0 && (
        <>
          <Spacer t="2.4rem" b="1.6rem">
            <Heading tag={4}>Collections</Heading>
          </Spacer>
          {collections.map((item) => (
            <Spacer b="1rem">
              <Link key={item.key} item={item} />
            </Spacer>
          ))}
        </>
      )}
      <hr />
      {socials && socials.length > 0 && (
        <>
          <Spacer t="2.4rem" b="1.6rem">
            <Heading tag={4}>Social</Heading>
          </Spacer>
          {socials.map((item) => (
            <Spacer b="1rem">
              <Link key={item.key} item={item} />
            </Spacer>
          ))}
        </>
      )}
    </>
  ) : null;
}
