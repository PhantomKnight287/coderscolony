import { MetaTags } from "@components/meta";
import { readCookie } from "@helpers/cookies";
import { useHydrateUserContext } from "@hooks/hydrate/context";
import { useUser } from "@hooks/user";
import {
	Avatar,
	Button,
	Container,
	Image,
	Loader,
	Menu,
	Skeleton,
	Text,
	useMantineColorScheme,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { ForumMemberRoles, Forums } from "db";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";
import styles from "../../../styles/dynamic-forum-page.module.scss";
import { IconCalendar, IconDots, IconUsers } from "@tabler/icons";
import dayjs from "dayjs";
import { monthNames } from "../../../constants/months";
import { numberWithCommas } from "@helpers/number";
import { ForumSidebar } from "@components/sidebar/forum";
import { useIntersection } from "@mantine/hooks";
import dynamic from "next/dynamic";
import ForumPost from "@components/post/forum-post";
import type { ForumPost as ForumPostType } from "../../../types/forum-post";
import { client } from "../../_app";
import { openConfirmModal } from "@mantine/modals";
import { useSidebar } from "@hooks/sidebar";
import useCollapsedSidebar from "@hooks/sidebar/use-collapsed-sidebar";
import { imageResolver } from "@helpers/profile-url";
import { outfit, spaceGrotest } from "../../../fonts";
import clsx from "clsx";
import Link from "next/link";

const Editor = dynamic(
	() => import("../../../components/editor").then((d) => d.Editor),
	{
		// Disable during server side rendering
		ssr: false,

		// Render anything as fallback on server, e.g. loader or html content without editor
		loading: () => null,
	}
);

interface ApiData extends Forums {
	profileImage: null | string;
	forumMembers: number;
	moderators: {
		role: "MODERATOR";
		user: {
			username: string;
			profileImage: string;
			name: string;
		};
	}[];
	userRole: ForumMemberRoles;
	admins: {
		role: "ADMIN";
		user: {
			username: string;
			profileImage: string;
			name: string;
		};
	}[];
}
const Forum = ({
	pageProps,
}: {
	pageProps: InferGetStaticPropsType<typeof getStaticProps>;
}) => {
	useHydrateUserContext();
	const { query, isReady, replace, push, asPath } = useRouter();
	const { id } = useUser();
	const [data, setData] = useState<ApiData | undefined>(pageProps);
	const {
		data: posts,
		error,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
		status,
		refetch,
	} = useInfiniteQuery(
		["posts"],
		async (p) => {
			const res = await axios
				.get<{
					posts: ForumPostType[];
					next?: number;
				}>(`/api/forums/${query.name}/posts?take=${p.pageParam || 5}`)
				.catch((err) => null);
			if (res === null) throw new Error("Unable to Fetch");

			return res.data;
		},
		{
			getNextPageParam: (lastPage, pages) => lastPage.next,
		}
	);
	const [forumEditable, setForumEditable] = useState(false);
	const [joined, setJoined] = useState(false);
	const { colorScheme } = useMantineColorScheme();
	const postsContainerRef = useRef<HTMLDivElement>(null);
	const { ref, entry } = useIntersection({
		root: postsContainerRef.current,
		threshold: 1,
	});
	const createPost = (content: string, slug: string) => {
		const cookie = readCookie("token");
		if (!cookie)
			return showNotification({
				message: "Session Expired. Please Login Again",
				color: "red",
			});
		const forumSlug = query.name;
		if (!forumSlug) return replace("/404");
		axios
			.post<{ slug: string }>(
				`/api/forums/posts/${forumSlug}/create`,
				{ content, slug },
				{
					headers: {
						authorization: `Bearer ${cookie}`,
					},
				}
			)
			.then((d) => d.data)
			.then((d) => push(`/f/${query.name}/post/${d.slug}`))
			.catch((err) => {
				return showNotification({
					message: err.response?.data?.message || "An Error Occured",
					color: "red",
				});
			});
	};

	useEffect(() => {
		const cookie = readCookie("token");
		if (!query.name) return;
		const headers: Record<string, string> = {};
		if (cookie) headers["authorization"] = `Bearer ${cookie}`;
		axios
			.get(
				cookie
					? `/api/forums/${query.name}/authenticated`
					: `/api/forums/${query.name}`,
				{ headers }
			)
			.then((d) => d.data)
			.then(setData)
			.catch((err) => {
				return showNotification({
					message: err.response?.data?.message || "An Error Occured",
					color: "red",
				});
			});
	}, [isReady, id]);

	useEffect(() => {
		if (entry?.isIntersecting) {
			fetchNextPage();
		} else {
			refetch();
		}
	}, [entry?.isIntersecting]);

	useEffect(() => {
		return () => {
			async () => {
				return await client.invalidateQueries();
			};
		};
	}, []);

	useEffect(() => {
		const controller = new AbortController();
		const cookie = readCookie("token");
		if (cookie) {
			axios
				.get(`/api/editable/forum/${query.name}`, {
					signal: controller.signal,
					headers: {
						authorization: `Bearer ${cookie}`,
					},
				})
				.then((d) => d.data)
				.then(({ editable, joined }) => {
					setForumEditable(editable);
					setJoined(joined);
				})
				.catch(() => {});
		}
		return () => {
			controller.abort();
		};
	}, []);

	const [content, setContent] = useState("");
	useCollapsedSidebar();
	const [imageLoaded, setImageLoaded] = useState(false);
	const openConfirmationModal = () =>
		openConfirmModal({
			title: "Please confirm your action",
			children: (
				<Text size="sm">
					You&apos;re about to leave this forum. You&apos;ll not
					recieve updates regarding this forum. If you&apos;re the
					only admin, this forum will be deleted.
				</Text>
			),
			onConfirm: leaveForum,
			centered: true,
			labels: {
				cancel: "Cancel",
				confirm: "Leave",
			},
			confirmProps: {
				style: {
					backgroundColor: "red",
				},
			},
		});
	const leaveForum = () => {
		const cookie = readCookie("token");
		if (!cookie)
			return showNotification({
				message: "This session has expired. Please Login Again.",
				color: "red",
			});
		axios
			.post<{ goBack?: boolean }>(
				`/api/forums/${query.name}/leave`,
				undefined,
				{
					headers: {
						authorization: `Bearer ${cookie}`,
					},
				}
			)
			.then((d) => d.data)
			.then((d) => {
				if (d.goBack) {
					client.invalidateQueries();
					replace("/f");
				}
			})
			.catch((err) =>
				showNotification({
					message: err.response?.data?.message || "An Error Occured.",
				})
			);
	};

	if (data === undefined)
		return (
			<div className="flex flex-col items-center justify-center h-screen">
				<Loader variant="dots" />
			</div>
		);

	return (
		<div className="flex flex-col">
			<MetaTags
				description={""}
				title={`${data.name} | Coders Colony`}
				ogImage={
					!data.profileImage
						? `https://avatars.dicebear.com/api/big-smile/${data.urlSlug}.png`
						: data.profileImage.startsWith(
								"https:///avatars.dicebear.com"
						  )
						? data.profileImage
						: `/images/${data.profileImage}`
				}
			/>
			{data.bannerColor || data.bannerImage ? (
				<div className="flex flex-col items-center justify-center">
					{data.bannerImage ? (
						<Skeleton visible={!imageLoaded}>
							<Image
								classNames={{
									image: "object-cover  max-h-[300px]",
								}}
								onLoad={() => setImageLoaded(true)}
								src={imageResolver(data.bannerImage)}
								className="rounded-md overflow-hidden object-cover"
							/>
						</Skeleton>
					) : data.bannerColor ? (
						<div
							className="rounded-md overflow-hidden max-h-[300px] h-[300px] w-[70%]"
							style={{
								backgroundColor: data.bannerColor,
							}}
						></div>
					) : null}
				</div>
			) : null}
			<Container className="flex flex-row flex-nowrap">
				<div>
					<div className="w-max h-max mt-[-2rem] flex items-center flex-row justify-center">
						<Avatar
							src={
								data.profileImage
									? data.profileImage.startsWith(
											"https://avatar.dicebar"
									  )
										? data.profileImage
										: `/images/${data.profileImage}`
									: `https://avatars.dicebear.com/api/big-smile/${data.name}.svg`
							}
							size={160}
							radius={80}
							className="bg-[#171718] border-4 ml-[20px] border-[#171718]"
						/>
						<div className="flex flex-col ml-3 mt-8">
							<h1
								className={clsx(
									`text-xl font-bold ${outfit.className} overflow-hidden w-full text-ellipsis font-outfit`,
									{
										"text-white": colorScheme === "dark",
									}
								)}
							>
								{data.name}
							</h1>
							<Text
								color="dimmed"
								className={clsx(`${outfit.className}`)}
							>
								f/{data.urlSlug}
							</Text>
							<div className="flex flex-row gap-2 mt-3 items-center">
								{joined ? (
									<Button
										variant="outline"
										radius="md"
										color={joined ? "red" : "green"}
										onClick={openConfirmationModal}
									>
										{joined ? "Leave" : "Join"}
									</Button>
								) : null}

								{forumEditable ? (
									<Link
										href={`${asPath}/edit`}
										className="text-blue-500 hover:underline"
									>
										<Button
											variant="outline"
											radius="md"
											color={"yellow"}
										>
											Edit
										</Button>
									</Link>
								) : null}
							</div>
						</div>
					</div>
					<div className="mt-5">
						<Editor
							content={content}
							setContent={setContent}
							createPost={createPost}
						/>
					</div>
					<div ref={postsContainerRef}>
						{status === "loading" ? (
							<p>Loading...</p>
						) : status === "error" ? (
							<p>Error: {(error as any).message}</p>
						) : (
							<>
								{posts.pages.map((post, id) => (
									<Fragment key={id}>
										{post.posts.map((p_) => (
											<ForumPost {...p_} key={p_.id} />
										))}
									</Fragment>
								))}
							</>
						)}
						<div>
							{isFetchingNextPage ? (
								"Loading more..."
							) : hasNextPage ? (
								<Button
									className={
										hasNextPage
											? "bg-[#1864ab] bg-opacity-80 hover:scale-110  duration-[110ms]"
											: undefined
									}
									onClick={() => fetchNextPage()}
									disabled={
										!hasNextPage || isFetchingNextPage
									}
								>
									Load More
								</Button>
							) : null}
						</div>
						<div>
							{isFetching && !isFetchingNextPage ? (
								"Fetching..."
							) : (
								<p className="text-center text-sm mt-4">
									{(posts?.pages || []).length > 0
										? "No More Posts"
										: "No Posts Found"}
								</p>
							)}
						</div>
						<div ref={ref} className="opacity-0">
							<Text weight={700}>
								Lorem, ipsum dolor sit amet consectetur
								adipisicing elit. Ipsum expedita quas laboriosam
								maiores quod, nobis molestias quo inventore rem
								modi consequuntur impedit rerum eum nisi dolore
								beatae molestiae nemo!
							</Text>
						</div>
					</div>
				</div>
				<div className="ml-4 mt-5 h-full flex-[0.15] lg:border-l-[1px] border-[#2c2c2c] hidden lg:block">
					<ForumSidebar
						admins={data.admins}
						moderators={data.moderators}
					/>
				</div>
			</Container>
		</div>
	);
};

export default Forum;

export const getStaticPaths: GetStaticPaths = async () => {
	const forums: Array<{ urlSlug: string }> = await (
		await fetch(`${process.env.API_URL}/static/forums`)
	).json();
	return {
		fallback: "blocking",
		paths: forums.map((f) => ({ params: { name: f.urlSlug } })),
	};
};

export const getStaticProps: GetStaticProps<ApiData> = async ({ params }) => {
	const data = await axios
		.get(`${process.env.API_URL}/forums/${params!.name!}`)
		.catch((err) => {
			console.log(err.response?.data);
			return null;
		});
	if (data === null)
		return {
			redirect: {
				destination: "/500",
				permanent: false,
			},
		};
	return {
		props: data.data as any,
	};
};
