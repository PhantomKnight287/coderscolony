import { BlogPost } from "@components/blog/item";
import { SimpleGrid } from "@mantine/core";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Blog } from "db";
import { useRouter } from "next/router";
import { Fragment, useEffect } from "react";

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
    blogs: Array<
      Partial<Blog> & {
        author: { username: string; id: string; profileImage: string };
      }
    >;
    next?: number;
  }>(["blogs"], (d) => fetcher({ pageParams: d.pageParam }), {
    getNextPageParam: (lastPage, pages) => lastPage.next,
    enabled: isReady,
  });

  useEffect(() => {
    console.log(data);
  }, []);

  return status === "loading" ? (
    <p>Loading...</p>
  ) : status === "error" ? (
    <p>Error: {(error as Error).message}</p>
  ) : (
    <>
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
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
            ? "Load More"
            : "Nothing more to load"}
        </button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
    </>
  );
}
