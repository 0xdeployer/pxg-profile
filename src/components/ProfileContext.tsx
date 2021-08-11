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
}>({ data: null, nfts: null });

export type NFTFromCyber = {
  collection: {
    external_url: string;
    name: string;
    image_url: string;
  };
  name: string;
  image_url: string;
  description: string;
  token_id: string;
};

function ProfileProvider({ children }: { children: React.ReactNode }) {
  const context = useContext(Web3Context);
  const match = useRouteMatch<{ name: string }>();
  const [data, updateData] = useState<ProfileDataType | null>(null);
  const [nfts, updateNfts] = useState<NFTFromCyber[]>();
  const [exhibitId, updateExhibitId] = useState();

  const getGallery = async (address: string) => {
    const { gallery } = await pxgLib.getDefaultGallery(address);
    if (gallery?.id) {
      updateExhibitId(gallery?.id);
    }
    if (gallery?.artworks) {
      const nfts = Object.values(gallery.artworks).map(
        (item: any) => item.data
      );
      updateNfts(nfts);
    }
  };

  React.useEffect(() => {
    if (context?.connected) {
      const getData = async () => {
        let owner = "";
        try {
          owner = await pxgLib.ownerOfNode(match.params.name);
          getGallery(owner);
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
        exhibitId,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export default ProfileProvider;
