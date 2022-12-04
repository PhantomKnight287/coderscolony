import { useDrawer } from "@hooks/drawer";
import { Drawer } from "@mantine/core";
import { ReactNode } from "react";
import styles from "./drawer.module.scss";

export function DrawerWrapper(props: { children: ReactNode | ReactNode[] }) {
	const { opened, setOpened } = useDrawer();

	return (
		<>
			<Drawer
				opened={opened}
				className={styles.wrapper}
				onClose={() => setOpened(false)}
			>
				{props.children}
			</Drawer>
			<div className={styles.contentWrapper}>{props.children}</div>
		</>
	);
}
