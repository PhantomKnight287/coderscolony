import CommentsEditor from "@components/comments/editor";
import { Container } from "@components/container";
import { MetaTags } from "@components/meta";
import { PostAuthor } from "@components/post/forum-post/post-author";
import { Renderer } from "@components/renderer";
import { PostToolBar } from "@components/toolbar/per-post";
import { readCookie } from "@helpers/cookies";
import { getMarkdownString } from "@helpers/showdown";
import { useHydrateUserContext } from "@hooks/hydrate/context";
import useCollapsedSidebar from "@hooks/sidebar/use-collapsed-sidebar";
import { useUser } from "@hooks/user";
import { Loader, LoadingOverlay } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { dislikePost, likePost } from "@services/post-actions";
import { IconArrowLeft } from "@tabler/icons";
import axios from "axios";
import {
	GetStaticPaths,
	GetStaticProps,
	InferGetStaticPropsType,
	NextPage,
} from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SinglePost } from "~types/forum-post";
import styles from "@styles/post.module.scss";
import clsx from "clsx";

async function fetchStats(
	postSlug: string,
	forumSlug: string,
	token?: string | null
) {
	return await axios.get<{
		likes: number;
		liked: boolean;
		menuConfig?: {
			author: boolean;
			moderator: boolean;
			admin: boolean;
		};
	}>(`/api/stats/${forumSlug}/${postSlug}`, {
		headers: token
			? {
					Authorization: `Bearer ${token}`,
			  }
			: undefined,
	});
}

const PostsPage: NextPage<{
	pageProps: InferGetStaticPropsType<typeof getStaticProps>;
}> = ({ pageProps }) => {
	useHydrateUserContext();

	const { query, isReady, replace } = useRouter();
	const [likes, setLikes] = useState(pageProps.post.likedBy || 0);
	const [liked, setLiked] = useState(pageProps.post.liked || false);
	const { id } = useUser();
	const [menuConfig, setMenuConfig] = useState({
		author: false,
		moderator: false,
		admin: false,
	});
	useCollapsedSidebar();

	useEffect(() => {
		if (!isReady) return;
		fetchStats(
			query.slug as string,
			query.name as string,
			readCookie("token")
		)
			.then((d) => d.data)
			.then((d) => {
				setLikes(d.likes);
				setLiked(d.liked);
				if (d.menuConfig) setMenuConfig(d.menuConfig);
			})
			.catch((e) => null);
	}, [isReady]);

	return (
		<Container>
			<MetaTags
				title={`${pageProps.post.author.name} on CodersColony: ${pageProps.post.content}`}
				description={pageProps.post.content}
			/>
			<Link href={`/f/${query.name}`}>
				<div className="mb-5 flex flex-row items-center gap-1 hover:underline">
					<IconArrowLeft size={18} />
					Go Back
				</div>
			</Link>
			<PostAuthor
				createdAt={pageProps.post.createdAt}
				{...pageProps.post.author}
				content={
					<p className="ml-2 text-[12px]">
						Posted in{" "}
						<Link
							href={`/f/${query.name}`}
							className="font-semibold hover:underline"
						>
							{pageProps.post.Forums.name}
						</Link>
					</p>
				}
				showMenu={
					menuConfig.author ||
					menuConfig.moderator ||
					menuConfig.admin ||
					false
				}
				deletePost={() => {
					axios
						.delete(
							`/api/forums/posts/${query.name}/${query.slug}`,
							{
								headers: {
									Authorization: `Bearer ${readCookie(
										"token"
									)}`,
								},
							}
						)
						.then((d) => {
							showNotification({
								message: "Post deleted successfully",
								color: "green",
							});
							replace(`/f/${query.name}`);
						})
						.catch((e) => {
							showNotification({
								message:
									e?.response?.data?.message ||
									"Something went wrong",
								color: "red",
							});
						});
				}}
			/>
			<div className="ml-10 pt-4">
				{typeof window != "undefined" ? (
					<Renderer classes={clsx({ [styles.container]: true })}>
						{getMarkdownString(pageProps.post.content)}
					</Renderer>
				) : (
					<Loader color={"green"} size="md" />
				)}
			</div>

			<PostToolBar
				linkToCopy={
					typeof window != "undefined" ? window.location.href : ""
				}
				likePost={async () => {
					if (!id)
						return showNotification({
							message: "You need to be logged in to like a post",
							color: "red",
						});
					if (liked === false) {
						return await likePost({
							postSlug: query.slug! as string,
							slug: query.name! as string,
							token: readCookie("token")!,
						}).then((data) => {
							if (data == null) {
								setLiked(true);
								return setLikes((o) => o + 1);
							}
							return showNotification({
								message: data,
								color: "red",
							});
						});
					} else {
						return await dislikePost({
							postSlug: query.slug! as string,
							slug: query.name! as string,
							token: readCookie("token")!,
						}).then((data) => {
							if (data == null) {
								setLiked(false);
								return setLikes((o) => o - 1);
							}
							return showNotification({
								message: data,
								color: "red",
							});
						});
					}
				}}
				likes={likes}
				liked={liked}
			/>
			{isReady === false ? (
				<LoadingOverlay visible={true} />
			) : (
				<CommentsEditor
					postSlug={query.slug as string}
					routeSlug={query.name as string}
					sendComment={(s: string) => {
						axios
							.post(
								`/api/comments/${query.name}/${query.slug}`,
								{ content: s },
								{
									headers: {
										authorization: `Bearer ${readCookie(
											"token"
										)}`,
									},
								}
							)
							.catch((err) => {
								return showNotification({
									message:
										err?.response?.data?.message ||
										"Something went wrong",
									color: "red",
								});
							});
					}}
					username={pageProps.post.author.username}
				/>
			)}
		</Container>
	);
};

export default PostsPage;

export const getStaticPaths: GetStaticPaths = async () => {
	const posts: Array<{ Forums: { urlSlug: string }; slug: string }> = await (
		await fetch(`${process.env.API_URL}/static/posts`)
	).json();

	return {
		fallback: "blocking",
		paths: posts.map((post) => ({
			params: { name: post.Forums.urlSlug, slug: post.slug },
		})),
	};
};

export const getStaticProps: GetStaticProps<SinglePost> = async ({
	params,
}) => {
	const data = await axios
		.get(
			`${process.env.API_URL}/forums/posts/${params!.name}/${
				params!.slug
			}`
		)
		.then((d) => d.data)
		.catch((err) => null);
	if (data === null)
		return {
			redirect: {
				destination: `/f/${params!.name}`,
				permanent: false,
			},
		};
	return {
		props: data,
	};
};
