import { Avatar, Menu, useMantineColorScheme } from "@mantine/core";
import clsx from "clsx";
import { ForumPost } from "../../../types/forum-post";
import styles from "./post-author.module.scss";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import { ReactNode } from "react";
import { IconDotsVertical, IconTrash } from "@tabler/icons";
import Link from "next/link";
import { useUser } from "@hooks/user";
import { profileImageResolver } from "@helpers/profile-url";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
	relativeTime: {
		future: "in %s",
		past: "%s ago",
		s: "few s",
		m: "1 min",
		mm: "%d mins",
		h: "1 hr",
		hh: "%d hrs",
		d: "1 d",
		dd: "%d d",
		M: "a month",
		MM: "%d months",
		y: "a yr",
		yy: "%d yrs",
	},
});

export function PostAuthor(
	props: ForumPost["author"] & {
		createdAt: string;
		content?: ReactNode;
		showMenu?: boolean;
		deletePost?: () => void;
	}
) {
	const { colorScheme } = useMantineColorScheme();
	const { username } = useUser();
	return (
		<>
			<div className="flex flex-row items-center justify-start">
				<Avatar
					src={profileImageResolver({
						profileURL: props.profileImage!,
						username,
					})}
					radius="xl"
				/>
				<div className="flex flex-col">
					<div className={clsx("flex flex-row")}>
						<Link href={`/u/${props.username}`}>
							<p
								className={clsx(
									"font-semibold text-[14px] ml-2 hover:underline cursor-pointer",
									{
										"text-white": colorScheme === "dark",
									}
								)}
							>
								{props.name}
							</p>
						</Link>
						<div className="flex items-center">
							<Link href={`/u/${props.username}`}>
								<p
									className={clsx(
										`text-[13px] ml-2 hover:underline cursor-pointer`,
										{
											"text-[#666666]":
												colorScheme === "dark",
										}
									)}
								>
									@{props.username}
								</p>
							</Link>
						</div>
						<div className="flex items-center">
							<p
								className={clsx(
									`text-[13px] ml-2 ${styles.timestamp}`,
									{
										"text-[#666666]":
											colorScheme === "dark",
									}
								)}
							>
								{dayjs(props.createdAt).fromNow(true)}
							</p>
						</div>
					</div>
					{props.content || null}
				</div>
				{props.showMenu ? (
					<Menu>
						<Menu.Target>
							<div className="flex ml-auto cursor-pointer">
								<IconDotsVertical
									size={20}
									color={
										colorScheme === "dark"
											? "white"
											: "black"
									}
								/>
							</div>
						</Menu.Target>
						<Menu.Dropdown>
							<Menu.Item
								color="red"
								onClick={props.deletePost}
								icon={<IconTrash size={14} />}
							>
								Delete This Post
							</Menu.Item>
						</Menu.Dropdown>
					</Menu>
				) : null}
			</div>
		</>
	);
}
