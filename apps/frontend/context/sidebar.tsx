import {
	createContext,
	Dispatch,
	FC,
	PropsWithChildren,
	SetStateAction,
	useState,
} from "react";

type SidebarContext_ = {
	opened: boolean;
	setOpened: Dispatch<SetStateAction<boolean>>;
};

export const SidebarContext = createContext<SidebarContext_ | null>(null);

export const SidebarProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
	const [opened, setOpened] = useState(true);

	return (
		<SidebarContext.Provider
			value={{
				opened,
				setOpened,
			}}
		>
			{children}
		</SidebarContext.Provider>
	);
};
