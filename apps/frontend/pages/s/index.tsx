import { Container } from "@components/container";
import { MetaTags } from "@components/meta";
import useCollapsedSidebar from "@hooks/sidebar/use-collapsed-sidebar";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Serieses } from "~types/series.types";
import { Fragment, useEffect, useRef } from "react";
import SeriesItem from "@components/series/item";
import { useIntersection } from "@mantine/hooks";

export default function Series() {
	useCollapsedSidebar();
	const { data, fetchNextPage, hasNextPage, status, refetch } =
		useInfiniteQuery<Serieses>({
			queryKey: ["all-series"],
			queryFn: async ({ pageParam = 0 }) => {
				const data = await fetch(`/api/series?take=${pageParam || 5}`);
				return await data.json();
			},
			getNextPageParam: (lastPage, all) => lastPage.next,
		});
	const containerRef = useRef<HTMLDivElement>(null);
	const { entry, ref } = useIntersection({
		root: containerRef.current,
		threshold: 0.5,
	});
	useEffect(() => {
		if (entry?.isIntersecting) {
			hasNextPage ? fetchNextPage() : refetch();
		}
	}, [entry?.isIntersecting]);
	return (
		<>
			<MetaTags
				description="View Series of Blogs on Coders Colony"
				title="Series | CodersColony"
			/>
			<Container>
				{status === "loading" ? (
					<div>Loading</div>
				) : status === "error" ? (
					<div>Error</div>
				) : (
					<div ref={containerRef}>
						{data.pages.map((page, index) => {
							return (
								<Fragment key={index}>
									{page.series.map((series) => {
										return (
											<SeriesItem
												key={series.id}
												{...series}
											/>
										);
									})}
								</Fragment>
							);
						})}
						<div ref={ref} className="h-10"></div>

						{data.pages.length === 0 ||
						data.pages[0]?.series?.length == 0 ? (
							<div className="text-center text-2xl font-bold">
								No Series Found
							</div>
						) : null}
					</div>
				)}
			</Container>
		</>
	);
}
