import React, { useContext, useState } from "react";
import { useRouteMatch } from "react-router";
import { AvatarType, pxgLib } from "../pxg-lib";
import { Web3Context } from "../Web3Provider";
// @ts-ignore
import namehash from "eth-ens-namehash";

type ProfileContextType = {
  owner: string;
  avatar?: AvatarType;
};

const loadingDefaultState = {
  owner: true,
  avatar: true,
};

const ProfileContext = React.createContext<{
  loading: {
    owner: boolean;
    avatar: boolean;
  };
  data: ProfileContextType | null;
}>({ loading: loadingDefaultState, data: null });

function ProfileProvider({ children }: { children: React.ReactNode }) {
  const context = useContext(Web3Context);
  const match = useRouteMatch<{ name: string }>();
  const [loading, updateLoading] = useState(loadingDefaultState);
  const [data, updateData] = useState<ProfileContextType | null>(null);

  React.useEffect(() => {
    if (context?.connected) {
      const getData = async () => {
        let owner = "";
        try {
          owner = await pxgLib.ownerOfNode(match.params.name);
          updateLoading((loading) => ({ ...loading, owner: false }));
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
          updateLoading((loading) => ({ ...loading, avatar: false }));
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

  return (
    <ProfileContext.Provider
      value={{
        loading,
        data,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export default ProfileProvider;
