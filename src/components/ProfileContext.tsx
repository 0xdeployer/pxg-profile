import React, { useContext, useState } from "react";
import { useRouteMatch } from "react-router";
import { AvatarType, pxgLib } from "../pxg-lib";
import { Web3Context } from "../Web3Provider";
// @ts-ignore
import namehash from "eth-ens-namehash";

type ProfileDataType = {
  owner: string;
  avatar?: AvatarType;
  label?: string;
};

type ProfileNftsType = NFTFromCyber[];

export const ProfileContext = React.createContext<{
  data: ProfileDataType | null;
  nfts?: ProfileNftsType | null;
  exhibitId?: string;
  loading: boolean;
  exhibitsLoading: boolean;
  allGalleries?: CyberExhibit[] | null;
  getGallery?: any;
  links?: LinkType[] | null;
}>({
  links: null,
  data: null,
  nfts: null,
  allGalleries: null,
  loading: true,
  exhibitsLoading: true,
});

export type NFTFromCyber = {
  collection: {
    external_url: string;
    name: string;
    image_url: string;
  };
  owner: {
    address: string;
  };
  name: string;
  image_url: string;
  description: string;
  token_id: string;
  contract_address: string;
  permalink: string;
};

type CyberExhibit = {
  id: string;
  artworks: any;
  info: {
    headline: string;
    heroImg: string;
  };
  owner: string;
};

export type LinkType = {
  category: "collection" | "social";
  key: string;
  value: string;
};

function ProfileProvider({ children }: { children: React.ReactNode }) {
  const context = useContext(Web3Context);
  const match = useRouteMatch<{ name: string }>();
  const [data, updateData] = useState<ProfileDataType | null>(null);
  const [nfts, updateNfts] = useState<NFTFromCyber[]>();
  const [allNfts, updateAllNfts] = useState<NFTFromCyber[]>();
  const [exhibitId, updateExhibitId] = useState<string>();
  const [allGalleries, updateAllGalleries] = useState<CyberExhibit[]>();
  const [links, updateLinks] = useState<LinkType[]>();
  const [loading, updateLoading] = useState(true);
  const [exhibitsLoading, updateExhibitsLoading] = useState(true);

  const getGallery = async () => {
    const { gallery } = await pxgLib.getDefaultGallery(match.params.name);
    if (gallery?.id) {
      updateExhibitId(gallery?.id);
    }
    if (gallery?.artworks) {
      const nfts = Object.values(gallery.artworks).map(
        (item: any) => item.data
      );
      updateNfts(nfts);
    }
    updateExhibitsLoading(false);
  };

  React.useEffect(() => {
    if (context?.connected) {
      const getAllGalleries = async () => {
        const data = await fetch(
          `https://cyber-jfl9w.ondigitalocean.app/experiences/user/${pxgLib.accounts?.[0].toLowerCase()}`
        ).then((res) => res.json());
        if (data?.success) {
          updateAllGalleries(
            data.exhibits.filter(
              (item: any) =>
                item.owner.toLowerCase() === pxgLib.accounts?.[0].toLowerCase()
            )
          );
        }
      };
      const getData = async () => {
        let owner = "";
        try {
          owner = await pxgLib.ownerOfNode(match.params.name);
          console.log(owner);
          if (owner === pxgLib.constants.ZERO_ADDRESS) {
            owner = "";
          }
          if (!owner) return;
          if (owner.toLowerCase() === pxgLib.accounts?.[0].toLowerCase()) {
            getAllGalleries();
          }
          const { links: currentLinks } = await pxgLib.getLinks(
            match.params.name
          );
          updateLinks(currentLinks);
          getGallery();
        } catch (e) {
          if (e.message.includes("owner query for nonexistent token")) {
            // can register token
          } else {
            // maybe can register name
          }
          console.log("error", e.message);
        }

        let avatar: AvatarType;
        try {
          avatar = await pxgLib.getDefaultAvatar(match.params.name);
        } catch (e) {}

        updateData((data) => ({
          ...(data ?? {}),
          owner,
          avatar,
          label: namehash.normalize(`${match.params.name}`),
        }));
        updateLoading(false);
      };

      getData();
    }
  }, [context?.connected, match.params.name]);
  console.log(`EXHIBIT`, exhibitId);
  return (
    <ProfileContext.Provider
      value={{
        data,
        nfts,
        loading,
        exhibitsLoading,
        exhibitId,
        allGalleries,
        getGallery,
        links,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export default ProfileProvider;
