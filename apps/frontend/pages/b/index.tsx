import { BlogPost } from "@components/blog/card";
import BlogItem from "@components/blog/item";
import { MetaTags } from "@components/meta";
import { useHydrateUserContext } from "@hooks/hydrate/context";
import { useSidebar } from "@hooks/sidebar";
import { Button, Container, Loader, SimpleGrid } from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Fragment, useEffect, useRef } from "react";
import { Blogs } from "~types/blog";

export default function BlogsPage() {
	const { setOpened, opened } = useSidebar();

	const fetcher = async ({ pageParam = 0 }) => {
		const data = await fetch(`/api/blogs?take=${pageParam || 5}`);
		return await data.json();
	};
	const containerRef = useRef<HTMLDivElement>();
	const { ref, entry } = useIntersection({
		root: containerRef.current,
		threshold: 1,
	});
	useHydrateUserContext();
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
	}>(["all-blogs"], (d) => fetcher({ pageParam: d.pageParam }), {
		getNextPageParam: (lastPage, all) => lastPage.next,
	});
	useEffect(() => {
		if (opened === true) return setOpened(false);
		return () => setOpened(true);
	}, []);

	useEffect(() => {
		if (entry?.isIntersecting) fetchNextPage();
	}, [entry?.isIntersecting]);

	return (
		<>
			<MetaTags
				title="Blogs"
				description="View Latest Blogs Created on CodersColony"
			/>
			<Container ref={containerRef as any}>
				{status === "loading" ? (
					<Loader variant="dots" color="green" />
				) : status === "error" ? (
					<p> Error: {(error as Error).message}</p>
				) : (
					data.pages.map((d, i) => (
						<Fragment key={i}>
							{d.blogs?.map((blog) => (
								<BlogItem {...blog} key={blog.id} />
							))}
						</Fragment>
					))
				)}
				<div ref={ref}>
					{isFetchingNextPage ? (
						"Loading more..."
					) : hasNextPage ? (
						<Button
							variant="outline"
							color={"green"}
							onClick={() => fetchNextPage()}
							disabled={!hasNextPage || !isFetchingNextPage}
						>
							Load More
						</Button>
					) : (
						"Nothing more to load"
					)}
				</div>
				<div>
					{isFetching && !isFetchingNextPage ? "Fetching..." : null}
				</div>
			</Container>
		</>
	);
}
