import { Container } from "@components/container";
import { Editor } from "@components/editor";
import { Button, Paper, Skeleton, TextInput } from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import Comment from ".";

interface Props {
	sendComment: (comment: string) => void;
	postSlug: string;
	routeSlug: string;
	username: string;
	isBlog?: boolean;
}

export default function CommentsEditor(props: Props) {
	const [comment, setComment] = useState("");
	const { data, isLoading, error, fetchNextPage, refetch, hasNextPage } =
		useInfiniteQuery<{
			comments: {
				id: string;
				author: {
					name: string;
					username: string;
					profileImage: string;
				};
				content: string;
				createdAt: string;
			}[];
			next?: number;
		}>({
			queryKey: ["comments", props.postSlug, props.routeSlug],
			queryFn: async ({ pageParam = 5 }) => {
				const data = await fetch(
					props.isBlog
						? `/api/comments/blog/${props.routeSlug}/${props.postSlug}?take=${pageParam}`
						: `/api/comments/${props.routeSlug}/${props.postSlug}?take=${pageParam}`
				);
				return data.json();
			},
			getNextPageParam: (lastPage) => lastPage?.next,
		});
	const containerRef = useRef<HTMLDivElement>(null);
	const { ref, entry } = useIntersection({
		root: containerRef.current,
		threshold: 0.5,
	});

	useEffect(() => {
		if (entry?.isIntersecting) {
			fetchNextPage();
		}
	}, [entry?.isIntersecting]);

	return (
		<Container className="mt-8">
			<Paper p="md" radius="md" ref={containerRef}>
				<p className="text-[14px] leading-[20px] text-[#666666] mb-4">
					Replying to{" "}
					<Link
						href={`/u/${props.username}`}
						className="text-blue-500 hover:underline"
					>
						@{props.username}
					</Link>
				</p>

				<Editor
					content={comment}
					createPost={() => {}}
					clickOnSendIconHandler={() => {
						props.sendComment(comment);
						setComment("");
						setTimeout(() => {
							hasNextPage ? fetchNextPage() : refetch();
						}, 200);
					}}
					setContent={setComment}
				/>
			</Paper>
			{isLoading && <p>Loading...</p>}

			<div ref={ref} className="mt-8">
				<Skeleton visible={isLoading}>
					{data?.pages.map((d, index) => (
						<Fragment key={index}>
							{d.comments?.map((comment) => (
								<Paper
									key={comment.id}
									p="md"
									radius="md"
									m="sm"
								>
									<Comment
										key={comment.id}
										{...comment.author}
										createdAt={comment.createdAt}
										content={comment.content}
									/>
								</Paper>
							))}
						</Fragment>
					))}
				</Skeleton>
			</div>
		</Container>
	);
}
