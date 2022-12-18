import { outfit } from "@fonts/index";
import { imageResolver, profileImageResolver } from "@helpers/profile-url";
import {
	Avatar,
	createStyles,
	Group,
	Image,
	Paper,
	Skeleton,
	Text,
	useMantineColorScheme,
} from "@mantine/core";
import clsx from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import { useRouter } from "next/router";
import { useState } from "react";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
	relativeTime: {
		future: "in %s",
		past: "%s ago",
		s: "few s",
		m: "1min",
		mm: "%dmins",
		h: "1hr",
		hh: "%dhrs",
		d: "1d",
		dd: "%dd",
		M: "amonth",
		MM: "%dmonths",
		y: "ayr",
		yy: "%dyrs",
	},
});

const useStyles = createStyles((theme) => ({
	timestamp: {
		"::before": {
			content: "'•'",
			fontSize: "10px",
			marginRight: "4px",
		},
	},
}));
interface Series {
	image: string;
	description: string | null;
	title: string;
	author: {
		username: string;
		name: string;
		profileImage: string | null;
	};
	slug: string;
	blogs: number;
	createdAt: Date;
	id: string;
}
interface ItemProps extends Series {}

export default function SeriesItem({
	author,
	blogs,
	createdAt,
	description,
	slug,
	id,
	image,
	title,
}: ItemProps) {
	const { push } = useRouter();
	const [avatarLoaded, setAvatarLoaded] = useState(false);
	const [imageLoaded, setImageLoaded] = useState(false);
	const { colorScheme } = useMantineColorScheme();
	const { classes } = useStyles();
	return (
		<Paper
			withBorder
			p="lg"
			className={clsx(`my-4 cursor-pointer`)}
			onClick={() => {
				push(`/s/${slug}`);
			}}
		>
			<Group
				position="left"
				style={{
					gap: "8px",
				}}
			>
				<Skeleton circle visible={!avatarLoaded}>
					<Avatar
						src={profileImageResolver({
							profileURL: author.profileImage!,
							username: author.username,
						})}
						size="sm"
						radius="xl"
						onLoad={() => setAvatarLoaded(true)}
					/>
				</Skeleton>
				<Text inline size="sm">
					{author.name}{" "}
				</Text>
				<Text
					inline
					size="sm"
					color="dimmed"
					className={classes.timestamp}
				>
					{dayjs(createdAt).fromNow(false)}
				</Text>
			</Group>
			<div className="flex flex-row mt-[12px]">
				<div className="flex flex-col flex-1">
					<h1
						className={clsx("text-2xl font-bold pb-[8px]", {
							"text-white": colorScheme === "dark",
							[outfit.className]: true,
						})}
					>
						{title}
					</h1>
					<Text
						lineClamp={4}
						className={clsx("", {
							"text-gray-400": colorScheme === "dark",
							"text-gray-700": colorScheme === "light",
						})}
					>
						{description}
					</Text>
				</div>
				<Skeleton
					visible={!imageLoaded}
					className={clsx("max-w-fit", {
						hidden: !image,
					})}
				>
					<Image
						src={
							image?.startsWith("/api/gen")
								? image
								: imageResolver(image!)
						}
						className={clsx("max-w-[150px] max-h-[150px]")}
						onLoad={() => setImageLoaded(true)}
						alt="Banner Image"
					/>
				</Skeleton>
			</div>
		</Paper>
	);
}
