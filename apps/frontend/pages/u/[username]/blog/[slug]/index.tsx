import { MetaTags } from "@components/meta";
import { Renderer } from "@components/renderer";
import { imageResolver, profileImageResolver } from "@helpers/profile-url";
import { getMarkdownString } from "@helpers/showdown";
import { useHydrateUserContext } from "@hooks/hydrate/context";
import { useSidebar } from "@hooks/sidebar";
import {
	ActionIcon,
	Avatar,
	Button,
	Container,
	Divider,
	Group,
	Image,
	Text,
	Title,
	Tooltip,
	useMantineColorScheme,
	useMantineTheme,
} from "@mantine/core";
import { useHydrate } from "@tanstack/react-query";
import axios from "axios";
import clsx from "clsx";
import dayjs from "dayjs";
import {
	GetStaticPaths,
	GetStaticProps,
	InferGetStaticPropsType,
	NextPage,
} from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Blogs } from "~types/blog";
import { monthNames } from "../../../../../constants/months";
import { isBlogEditable } from "@services/editable";
import { readCookie } from "@helpers/cookies";
import { useRouter } from "next/router";
import { IconHeart, IconPencil, IconTrash } from "@tabler/icons";
import CommentsEditor from "@components/comments/editor";
import { showNotification } from "@mantine/notifications";
import useCollapsedSidebar from "@hooks/sidebar/use-collapsed-sidebar";
import { outfit } from "@fonts/index";
import { numberWithCommas } from "@helpers/number";
import { useUser } from "@hooks/user";
import SeriesBanner from "@components/series/page/banner";

async function getBlogStats(
	username: string,
	slug: string,
	token?: string | null
) {
	return await axios.get<{
		likes: number;
		liked: boolean;
		deleteable: boolean;
	}>(`/api/stats/blog/${username}/${slug}`, {
		headers: token
			? {
					authorization: `Bearer ${token}`,
			  }
			: {},
	});
}

const BlogPage: NextPage<{
	pageProps: InferGetStaticPropsType<typeof getStaticProps>;
}> = ({ pageProps }) => {
	const { colorScheme } = useMantineColorScheme();
	const [editable, setEditable] = useState(false);
	const { query, isReady, asPath, push, replace } = useRouter();
	const theme = useMantineTheme();
	const [likes, setLikes] = useState(0);
	const [liked, setLiked] = useState(false);
	const { id } = useUser();
	const [deleteable, setDeleteable] = useState(false);

	useEffect(() => {
		if (!isReady) return;
		getBlogStats(
			query.username as string,
			query.slug as string,
			readCookie("token")
		)
			.then((d) => {
				setLikes(d.data.likes);
				setLiked(d.data.liked);
				setDeleteable(d.data.deleteable);
			})
			.catch((err) => {
				return showNotification({
					message:
						err?.response?.data?.message || "Something went wrong",
					color: "red",
				});
			});
	}, [isReady]);

	useHydrateUserContext();

	useCollapsedSidebar();

	useEffect(() => {
		if (!isReady) return;
		isBlogEditable(readCookie("token")!, query.slug as string)
			.then((d) => d.data)
			.then((d) => {
				setEditable(d.editable);
			})
			.catch((err) => {});
	}, [isReady]);

	return (
		<>
			<MetaTags
				title={pageProps.title!}
				description={pageProps.description!}
				ogImage={imageResolver(pageProps.ogImage!)}
			/>

			<Container mb="xl">
				<Image
					src={
						pageProps.ogImage?.startsWith("/api/gen")
							? pageProps.ogImage
							: imageResolver(pageProps.ogImage!)
					}
					style={{
						objectFit: "cover",
						borderRadius: 0,
						display: "block",
						width: "100%",
					}}
					classNames={{
						image: "rounded-md",
					}}
					alt="Banner Image"
				/>
				<Title
					className={clsx("my-2 text-center", {
						"text-white": colorScheme === "dark",
					})}
				>
					{pageProps.title}
				</Title>
				<Group mt="md" position="center">
					<Avatar
						src={profileImageResolver({
							profileURL: pageProps.author.profileImage,
							username: pageProps.author.username,
						})}
						size="md"
						radius="xl"
					/>
					<div className="gap-[2px] flex flex-row">
						<Link href={`/u/${pageProps.author.username}`}>
							<Text>{pageProps.author.name}</Text>
						</Link>
						<span className="mx-2">/</span>
						<Text>
							{dayjs(pageProps.createdAt).get("date")}{" "}
							{
								monthNames[
									dayjs(pageProps.createdAt).get("month")
								]
							}{" "}
							{dayjs(pageProps.createdAt).get("year")}
						</Text>
					</div>
				</Group>
				<div className="flex flex-row-reverse flex-wrap">
					<div className="ml-auto flex flex-row">
						<Text color={"dimmed"}>{pageProps.readTime}</Text>
						<Text
							color={"dimmed"}
							data-before="•"
							className="before:content-[attr(data-before)] before:mx-[8px]"
						>
							{new Intl.NumberFormat(undefined, {
								style: "decimal",
							}).format(likes)}{" "}
							likes
						</Text>
					</div>
					<div className="flex flex-row flex-nowrap">
						<Tooltip label={liked === true ? "Unlike" : "Like"}>
							<ActionIcon
								onClick={() => {
									if (!id)
										return showNotification({
											message:
												"You need to be logged in to like a blog",
											color: "red",
										});
									if (liked === true) {
										axios
											.delete(
												`/api/blog-action/${query.username}/${query.slug}/like`,
												{
													headers: {
														authorization: `Bearer ${readCookie(
															"token"
														)}`,
													},
												}
											)
											.then((d) => {
												setLiked(false);
												setLikes(likes - 1);
											})
											.catch((err) => {
												showNotification({
													message:
														err?.response?.data
															?.message ||
														"Something went wrong",
													color: "red",
												});
											});
									} else {
										axios
											.post(
												`/api/blog-action/${query.username}/${query.slug}/like`,
												{},
												{
													headers: {
														authorization: `Bearer ${readCookie(
															"token"
														)}`,
													},
												}
											)
											.then((d) => {
												setLiked(true);
												setLikes(likes + 1);
											})
											.catch((err) => {
												showNotification({
													message:
														err?.response?.data
															?.message ||
														"Something went wrong",
													color: "red",
												});
											});
									}
								}}
							>
								<IconHeart
									cursor={"pointer"}
									size={22}
									color={theme.colors.red[6]}
									fill={
										liked === true
											? theme.colors.red[6]
											: "none"
									}
								/>
							</ActionIcon>
						</Tooltip>

						{editable === true ? (
							<Tooltip label="Edit">
								<ActionIcon
									onClick={() => {
										push(`${asPath}/edit`);
									}}
								>
									<IconPencil
										cursor={"pointer"}
										size={22}
										color={theme.colors.indigo[6]}
									/>
								</ActionIcon>
							</Tooltip>
						) : null}
						{deleteable === true ? (
							<Tooltip label="Delete">
								<ActionIcon
									onClick={() => {
										axios
											.delete(
												`/api/blogs/${query.username}/blog/${query.slug}`,
												{
													headers: {
														authorization: `Bearer ${readCookie(
															"token"
														)}`,
													},
												}
											)
											.then((d) => {
												showNotification({
													message:
														"Blog deleted successfully",
													color: "green",
												});
												replace("/b");
											})
											.catch((err) => {
												showNotification({
													message:
														err?.response?.data
															?.message ||
														"Something went wrong",
													color: "red",
												});
											});
									}}
								>
									<IconTrash
										cursor={"pointer"}
										size={22}
										color={theme.colors.red[8]}
									/>
								</ActionIcon>
							</Tooltip>
						) : null}
					</div>
				</div>
				<Divider mt="sm" mb="md" />
				{pageProps.Series ? (
					<>
						<SeriesBanner {...pageProps.Series} />
						<Divider mt="sm" mb="md" />
					</>
				) : null}
				{typeof window !== "undefined" ? (
					<Renderer
						// eslint-disable-next-line react/no-children-prop
						children={getMarkdownString(pageProps.content!)}
					/>
				) : null}
				{isReady ? (
					<CommentsEditor
						postSlug={query.slug as string}
						routeSlug={query.username as string}
						sendComment={(d) => {
							axios
								.post(
									`/api/comments/blog/${query.username}/${query.slug}`,
									{ content: d },
									{
										headers: {
											authorization: `Bearer ${readCookie(
												"token"
											)}`,
										},
									}
								)
								.then(() => null)

								.catch((err) => {
									return showNotification({
										message:
											err?.response?.data?.message ||
											"Something went wrong",
										color: "red",
									});
								});
						}}
						username={pageProps.author.username}
						isBlog
					/>
				) : null}
			</Container>
		</>
	);
};

export const getStaticPaths: GetStaticPaths = async () => {
	const blogs: { slug: string; author: { username: string } }[] = await (
		await axios.get(`${process.env.API_URL}/blogs/generate/static`)
	).data;
	return {
		paths: blogs.map((blog) => ({
			params: {
				username: blog.author.username,
				slug: blog.slug,
			},
		})),
		fallback: "blocking",
	};
};

export const getStaticProps: GetStaticProps<Blogs> = async ({ params }) => {
	const { slug, username } = params as { username: string; slug: string };
	const data = await axios
		.get(`${process.env.API_URL}/blogs/${username}/blog/${slug}`)
		.catch((err) => {
			return null;
		});
	if (data === null)
		return {
			notFound: true,
		};
	return {
		props: { ...data.data },
	};
};

export default BlogPage;
