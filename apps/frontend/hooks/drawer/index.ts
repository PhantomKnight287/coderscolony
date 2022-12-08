import { useContext } from "react";
import { DrawerContext } from "../../context/drawer";

export function useDrawer() {
	const context = useContext(DrawerContext);
	if (context === null)
		throw new Error("Component Tree not wrapped in `DrawerProvider`");
	return context;
}
