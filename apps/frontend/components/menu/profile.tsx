import { readCookie } from "@helpers/cookies";
import { useUser } from "@hooks/user";
import { Menu, MenuProps, useMantineColorScheme } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import {
	isFollowable,
	followUser,
	unfollowUser,
} from "@services/profile.service";
import { IconGridDots } from "@tabler/icons";
import { useEffect, useMemo, useState } from "react";

interface Props extends Partial<MenuProps> {
	username: string;
	refetchStats: () => void;
}

export default function ProfileMenu(p: Props) {
	const { username, refetchStats, ...props } = useMemo(() => ({ ...p }), [p]);
	const [menuConfig, setMenuConfig] = useState({
		followable: false,
		reportable: false,
	});
	const { username: u } = useUser();
	useEffect(() => {
		const token = readCookie("token");
		if (!token) return;
		isFollowable({ token, username: username })
			.then((d) => d.data)
			.then((d) => {
				setMenuConfig((old) => ({
					...old,
					followable: d.followable,
					reportable: username.toLowerCase() !== u.toLowerCase(),
				}));
			})
			.catch((err) => {
				return null;
			});
	}, []);
	const { colorScheme } = useMantineColorScheme();
	return (
		<Menu {...props}>
			<Menu.Target>
				<IconGridDots
					color={colorScheme === "dark" ? "white" : undefined}
					cursor="pointer"
				/>
			</Menu.Target>
			<Menu.Dropdown>
				<Menu.Label>Profile</Menu.Label>
				{menuConfig.followable ? (
					<Menu.Item
						color="green"
						onClick={() => {
							followUser({
								username: username,
								token: readCookie("token")!,
							})
								.then(() => {
									setMenuConfig((old) => ({
										...old,
										followable: false,
									}));
									refetchStats();
								})
								.catch((err) => {
									showNotification({
										message:
											err?.response?.data?.message ||
											"Something went wrong",
										color: "red",
									});
								});
						}}
					>
						Follow
					</Menu.Item>
				) : (
					<Menu.Item
						color="red"
						onClick={() => {
							unfollowUser({
								username: username,
								token: readCookie("token")!,
							})
								.then(() => {
									setMenuConfig((old) => ({
										...old,
										followable: true,
									}));
									refetchStats();
								})
								.catch((err) => {
									showNotification({
										message:
											err?.response?.data?.message ||
											"Something went wrong",
										color: "red",
									});
								});
						}}
					>
						Unfollow
					</Menu.Item>
				)}
				<Menu.Divider />

				<Menu.Label>Danger zone</Menu.Label>
				{menuConfig.reportable ? (
					<>
						<Menu.Item color="red">Report</Menu.Item>
					</>
				) : null}
			</Menu.Dropdown>
		</Menu>
	);
}
