import { BlogPost } from "@components/blog/card";
import { Button, SimpleGrid } from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Blog } from "db";
import { useRouter } from "next/router";
import { Fragment, useEffect, useRef } from "react";
import { Blogs } from "~types/blog";

export function Blogs() {
	const { query, isReady } = useRouter();

	const fetcher = async ({ pageParams = 0 }) => {
		const res = await fetch(
			`/api/blogs/${query.username}?take=${pageParams || 5}`
		);
		return res.json();
	};
	const {
		data,
		error,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
		status,
	} = useInfiniteQuery<{
		blogs: Array<Blogs>;
		next?: number;
	}>(["blogs"], (d) => fetcher({ pageParams: d.pageParam }), {
		getNextPageParam: (lastPage, pages) => lastPage.next,
		enabled: isReady,
	});
	const containerRef = useRef<HTMLDivElement>();
	const { ref, entry } = useIntersection({
		root: containerRef.current,
		threshold: 1,
	});

	useEffect(() => {
		if (entry?.isIntersecting) fetchNextPage();
	}, [entry?.isIntersecting]);

	return status === "loading" ? (
		<p>Loading...</p>
	) : status === "error" ? (
		<p>Error: {(error as Error).message}</p>
	) : (
		<div ref={containerRef as any}>
			{data.pages.map((group, i) => (
				<SimpleGrid
					cols={3}
					spacing="md"
					my="xl"
					key={i}
					breakpoints={[
						{ maxWidth: "md", cols: 3, spacing: "md" },
						{ maxWidth: "sm", cols: 2, spacing: "sm" },
						{ maxWidth: "xs", cols: 1, spacing: "sm" },
					]}
				>
					{group.blogs?.map((blog) => (
						<BlogPost {...blog} key={blog.id} />
					))}
				</SimpleGrid>
			))}
			<div>
				{isFetchingNextPage ? (
					"Loading more..."
				) : hasNextPage ? (
					<Button
						variant="outline"
						color="green"
						disabled={!hasNextPage || isFetchingNextPage}
					>
						Load More
					</Button>
				) : null}
			</div>
			<div ref={ref}>
				{isFetching && !isFetchingNextPage ? "Fetching..." : null}
			</div>
		</div>
	);
}
