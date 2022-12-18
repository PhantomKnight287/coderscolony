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
import { useState } from "react";
import { Blogs } from "~types/blog";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import clsx from "clsx";
import { useRouter } from "next/router";
import { outfit } from "@fonts/index";

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

export default function BlogItem(props: Blogs) {
	const [imageLoaded, setImageLoaded] = useState(false);
	const [avatarLoaded, setAvatarLoaded] = useState(false);
	const { classes } = useStyles();
	const { colorScheme } = useMantineColorScheme();
	const { push } = useRouter();

	return (
		<Paper
			withBorder
			p="lg"
			className={clsx(`my-4 cursor-pointer`)}
			onClick={() => {
				push(`/u/${props.author.username}/blog/${props.slug}`);
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
							profileURL: props.author.profileImage!,
							username: props.author.username,
						})}
						size="sm"
						radius="xl"
						onLoad={() => setAvatarLoaded(true)}
					/>
				</Skeleton>
				<Text inline size="sm">
					{props.author.name}{" "}
				</Text>
				<Text
					inline
					size="sm"
					color="dimmed"
					className={classes.timestamp}
				>
					{dayjs(props.createdAt).fromNow(false)}
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
						{props.title}
					</h1>
					<Text
						lineClamp={4}
						className={clsx("", {
							"text-gray-400": colorScheme === "dark",
							"text-gray-700": colorScheme === "light",
						})}
					>
						{props.description}
					</Text>
				</div>
				<Skeleton
					visible={!imageLoaded}
					className={clsx("max-w-fit", {
						hidden: !props.ogImage,
					})}
				>
					<Image
						src={
							props.ogImage?.startsWith("/api/gen")
								? props.ogImage
								: imageResolver(props.ogImage!)
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
