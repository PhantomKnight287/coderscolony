import { ForumCard } from "@components/cards/forum";
import { MetaTags } from "@components/meta";
import { Renderer } from "@components/renderer";
import { useHydrateUserContext } from "@hooks/hydrate/context";
import { Button, Container, SimpleGrid } from "@mantine/core";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { ForumMember } from "db";
import { Fragment, useEffect } from "react";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@mantine/rte"), {
  // Disable during server side rendering
  ssr: false,

  // Render anything as fallback on server, e.g. loader or html content without editor
  loading: () => null,
});

function ForumsPage() {
  useHydrateUserContext();
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery(
    ["forums"],
    async (p) => {
      const res = await axios
        .get<{
          forums: {
            createdAt: Date;
            id: string;
            name: string;
            profileImage: string | null;
            bannerImage: string | null;
            forumMembers: number;
            urlSlug: string;
            description: string;
          }[];
          next?: number;
        }>(`/api/forums/list?take=${p.pageParam || 5}`)
        .catch((err) => null);
      if (res === null) throw new Error("Unable to Fetch");

      return res.data;
    },
    {
      getNextPageParam: (lastPage, pages) => lastPage.next,
    }
  );

  useEffect(() => {
    refetch();
  }, []);

  return (
    <>
      <MetaTags
        description="List of Forums Available on Coders Colony"
        title="Forums"
      />
      <SimpleGrid
        breakpoints={[
          { minWidth: "sm", cols: 2 },
          { minWidth: "md", cols: 3 },
          { minWidth: 1200, cols: 4 },
        ]}
      >
        {status === "loading" ? (
          <p>Loading...</p>
        ) : status === "error" ? (
          <p>Error: {(error as any)?.message}</p>
        ) : (
          <>
            {data?.pages.map((group, i) => (
              <Fragment key={i}>
                {group?.forums?.map((n) => (
                  
                    <ForumCard key={n.id} {...n} />
                  
                ))}
              </Fragment>
            ))}
          </>
        )}{" "}
      </SimpleGrid>
      <div className="mt-10 flex items-center justify-center mb-10">
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
            disabled={!hasNextPage || isFetchingNextPage}
          >
            Load More
          </Button>
        ) : null}
      </div>
      <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
    </>
  );
}

export default ForumsPage;
