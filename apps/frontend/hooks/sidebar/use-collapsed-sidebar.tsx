import { useEffect } from "react";
import { useSidebar } from ".";

export default function useCollapsedSidebar() {
	const { opened, setOpened } = useSidebar();

	useEffect(() => {
		if (opened === true) return setOpened(false);
		return () => setOpened(true);
	}, [opened]);
}
