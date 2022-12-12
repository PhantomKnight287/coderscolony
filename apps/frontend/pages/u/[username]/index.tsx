import { MetaTags } from "@components/meta";
import { useHydrateUserContext } from "@hooks/hydrate/context";
import {
	Avatar,
	Container,
	createStyles,
	Image,
	Skeleton,
	useMantineColorScheme,
	useMantineTheme,
} from "@mantine/core";
import clsx from "clsx";
import { User } from "db";
import {
	GetStaticPaths,
	GetStaticProps,
	InferGetStaticPropsType,
	NextPage,
} from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import styles from "@styles/username.module.scss";
import { fetchProfile } from "@services/profile-actions";
import { readCookie } from "@helpers/cookies";
import { useUser, useUserDispatch } from "@hooks/user";
import { ProfileTabs } from "@components/profile/tabs";
import { imageResolver, profileImageResolver } from "@helpers/profile-url";
import useCollapsedSidebar from "@hooks/sidebar/use-collapsed-sidebar";
import axios from "axios";
import { icons } from "@components/select/value";
import { Badge } from "@components/badge";

const useStyles = createStyles((theme) => ({
	image: {
		objectFit: "cover",
		maxHeight: "300px",
	},
}));

const UsernamePage: NextPage<{
	pageProps: InferGetStaticPropsType<typeof getStaticProps>;
}> = ({ pageProps }) => {
	const { colorScheme } = useMantineColorScheme();
	const { asPath, isReady, query } = useRouter();
	const [user, setUser] = useState(pageProps);
	const { classes } = useStyles();
	const [profileStats, setProfileStats] = useState({
		views: 0,
		following: 0,
		followers: 0,
	});
	const { username } = useUser();
	useCollapsedSidebar();
	useEffect(() => {
		if (!isReady) return;
		axios
			.get<{ views: number; followers: number; following: number }>(
				`/api/stats/${query.username}`
			)
			.then((d) => d.data)
			.then((data) => {
				setProfileStats({
					followers: data.followers,
					following: data.following,
					views: data.views,
				});
			})
			.catch((err) => {});
	}, [isReady]);

	useEffect(() => {
		if (!isReady) return;
		if (
			username &&
			username.toLocaleLowerCase() !==
				(query.username as string).toLocaleLowerCase()
		) {
			axios
				.post(`/api/profile/${query.username}`, undefined, {
					headers: {
						authorization: `Bearer ${readCookie("token")}`,
					},
				})
				.then((d) => d.data)
				.then(() => {
					setProfileStats((d) => ({ ...d, views: d.views + 1 }));
				})
				.catch((err) => null);
		}
	}, [isReady, username]);

	useHydrateUserContext();

	const theme = useMantineTheme();

	const [imageLoaded, setImageLoaded] = useState(false);

	return (
		<>
			<MetaTags
				description={`${user.name} on CodersColony`}
				title={`${user.name} | @${user.username} `}
			/>
			<Container>
				{user.bannerColor || user.bannerImage ? (
					<div className="flex flex-col items-center justify-center">
						{user.bannerImage ? (
							<Skeleton
								visible={!imageLoaded}
								className="w-full min-h-[300px] max-h-[300px]"
							>
								<Image
									classNames={{
										image: classes.image,
									}}
									onLoad={() => setImageLoaded(true)}
									src={imageResolver(user.bannerImage)}
									className="rounded-md overflow-hidden object-cover"
									alt="Banner Image"
								/>
							</Skeleton>
						) : user.bannerColor ? (
							<div
								className="rounded-md overflow-hidden max-h-[300px] h-[300px] w-[100%]"
								style={{
									backgroundColor: user.bannerColor,
								}}
							></div>
						) : null}
					</div>
				) : null}
				<div className="w-max h-max mt-[-5rem] flex items-center justify-center">
					<Avatar
						src={profileImageResolver({
							profileURL: user.profileImage!,
							username: user.username!,
						})}
						size={160}
						radius={80}
						className="bg-[#171718] border-4 ml-[20px] border-[#171718]"
					/>
				</div>
				<div className="ml-[20px]">
					<div className="flex items-center text-[16px] mt-5 font-[700] leading-[24px]">
						<div className="gap-[4px] flex items-center font-[700]">
							<p
								className={clsx("mr-[4px] ml-3", {
									"text-white": colorScheme === "dark",
								})}
							>
								{user.name}
							</p>
						</div>
					</div>
					<div className="flex flex-row items-center justify-start ml-3 gap-8">
						<span
							className={clsx("text-[13px] leading-[18px]", {
								"text-gray-500": colorScheme === "dark",
								"text-[#666666]": colorScheme === "light",
							})}
						>
							@{user.username}
						</span>
					</div>
					{user.oneLiner ? (
						<p
							className={clsx(
								"break-words ml-3 mt-4 leading-[24px]",
								{
									"text-white": colorScheme === "dark",
								}
							)}
						>
							{user.oneLiner}
						</p>
					) : null}
					<div className="ml-3 mt-5 flex items-center">
						<div className="flex-wrap items-center flex gap-[8px]">
							<span
								className={clsx("text-[13px] leading-[18px]", {
									"text-gray-300": colorScheme === "dark",
									"text-[#666666]": colorScheme === "light",
								})}
							>
								{profileStats.views} Views
							</span>
							<span
								className={clsx("text-[13px] leading-[18px]", {
									"text-gray-300": colorScheme === "dark",
									"text-[#666666]": colorScheme === "light",
									[styles.following]: true,
								})}
							>
								<Link
									href={`${asPath}/followers`}
									className="hover:underline"
								>
									{profileStats.followers} Followers
								</Link>
							</span>
							<span
								className={clsx(
									`text-[13px] leading-[18px] ${styles.following}`,
									{
										"text-gray-300": colorScheme === "dark",
										"text-[#666666]":
											colorScheme === "light",
									}
								)}
							>
								<Link
									href={`${asPath}/following`}
									className="hover:underline "
								>
									{profileStats.following} Following
								</Link>
							</span>
						</div>
					</div>
					<div className="flex flex-row flex-wrap pt-5">
						{user.interests?.map((i) => (
							<Badge
								key={i.id}
								icon={i.icon}
								color={i.color}
								p="md"
								style={{
									textTransform: "none",
								}}
							>
								{i.name}
							</Badge>
						))}
					</div>
				</div>
				<div className="mt-10">
					{typeof window !== "undefined" ? <ProfileTabs /> : null}
				</div>
			</Container>
		</>
	);
};

export const getStaticPaths: GetStaticPaths = async () => {
	const usernames: { username: string }[] = await (
		await fetch(`${process.env.API_URL}/static/profiles`)
	).json();
	return {
		fallback: "blocking",
		paths: usernames.map((username) => ({ params: username })),
	};
};

export const getStaticProps: GetStaticProps<
	Partial<
		User & {
			edit: boolean;
			followers: number;
			following: number;
			interests: {
				color: string;
				icon: string;
				id: string;
				name: string;
			}[];
		}
	>
> = async ({ params }) => {
	const data = await fetch(
		`${process.env.API_URL}/profile/${params!.username}`
	).catch(() => null);
	if (data === null) {
		return {
			redirect: {
				destination: "/404",
				permanent: false,
			},
		};
	}
	if (data.status == 404) {
		return {
			redirect: {
				destination: "/404",
				permanent: false,
			},
		};
	}
	return {
		props: {
			...(await data.json()),
		},
	};
};

export default UsernamePage;
