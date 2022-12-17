import { Container } from "@components/container";
import { MetaTags } from "@components/meta";
import useCollapsedSidebar from "@hooks/sidebar/use-collapsed-sidebar";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Serieses } from "~types/series.types";
import { Fragment } from "react";
import SeriesItem from "@components/series/item";

export default function Series() {
	useCollapsedSidebar();
	const {
		data,
		error,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
		status,
		refetch,
	} = useInfiniteQuery<Serieses>({
		queryKey: ["all-series"],
		queryFn: async ({ pageParam = 0 }) => {
			const data = await fetch(`/api/series?take=${pageParam || 5}`);
			return await data.json();
		},
		getNextPageParam: (lastPage, all) => lastPage.next,
	});
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
					<div>
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
					</div>
				)}
			</Container>
		</>
	);
}
