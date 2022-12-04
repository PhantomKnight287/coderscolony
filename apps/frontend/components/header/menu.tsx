import { useHydrateUserContext } from "@hooks/hydrate/context";
import { useUser } from "@hooks/user";
import { Menu, Text, Avatar } from "@mantine/core";
import {
	IconSettings,
	IconSearch,
	IconPhoto,
	IconMessageCircle,
	IconTrash,
	IconArrowsLeftRight,
	IconPlus,
	IconUser,
} from "@tabler/icons";
import { useRouter } from "next/router";
import { useState } from "react";

enum Modals {
	CREATE_NEW_FORUM,
}

export function UserMenu() {
	const { profileImage, name, username } = useUser();
	const { push } = useRouter();
	const [modals, setModals] = useState<Modals | null>(null);
	useHydrateUserContext();
	return (
		<>
			<Menu shadow="md" width={200} closeOnClickOutside closeOnEscape>
				<Menu.Target>
					<div className="flex flex-row hover:bg-[#5c5f6659] duration-75 rounded-md p-2 items-center">
						<Avatar
							src={
								profileImage
									? profileImage.startsWith(
											"https://avatar.dicebar"
									  )
										? profileImage
										: `/images/${profileImage}`
									: `https://avatars.dicebear.com/api/big-smile/${username}.svg`
							}
							radius="xl"
							size="md"
						/>
						<span className="hidden lg:inline ml-2">{name}</span>
					</div>
				</Menu.Target>

				<Menu.Dropdown>
					<Menu.Label>Application</Menu.Label>
					<Menu.Item
						onClick={() => push(`/u/${username}`)}
						icon={<IconUser size={14} />}
					>
						Profile
					</Menu.Item>
					<Menu.Item
						icon={<IconSettings size={14} />}
						onClick={() => push(`/u/${username}/settings`)}
					>
						Settings
					</Menu.Item>
					<Menu.Item icon={<IconPhoto size={14} />}>
						Gallery
					</Menu.Item>
					<Menu.Item
						icon={<IconSearch size={14} />}
						rightSection={
							<Text size="xs" color="dimmed">
								⌘K
							</Text>
						}
					>
						Search
					</Menu.Item>
					<Menu.Divider />
					<Menu.Label>Forums</Menu.Label>
					<Menu.Item
						icon={<IconPlus size={14} />}
						onClick={() => setModals(Modals.CREATE_NEW_FORUM)}
						color="blue"
					>
						Create
					</Menu.Item>
					<Menu.Label>Danger zone</Menu.Label>
					<Menu.Item icon={<IconArrowsLeftRight size={14} />}>
						Transfer my data
					</Menu.Item>

					<Menu.Item color="red" icon={<IconTrash size={14} />}>
						Delete my account
					</Menu.Item>
				</Menu.Dropdown>
			</Menu>
		</>
	);
}
