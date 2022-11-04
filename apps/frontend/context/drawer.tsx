import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useState,
} from "react";

type DrawerContext_ = {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
};

export const DrawerContext = createContext<DrawerContext_ | null>(null);

export const DrawerProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [drawerOpened, setDrawerOpened] = useState(false);
  return (
    <DrawerContext.Provider
      value={{
        opened: drawerOpened,
        setOpened: setDrawerOpened,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
};
