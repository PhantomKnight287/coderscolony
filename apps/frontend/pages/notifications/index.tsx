import { readCookie } from "@helpers/cookies";
import { useHydrateUserContext } from "@hooks/hydrate/context";
import { Button, Container, Notification } from "@mantine/core";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { NotificationVariants } from "db";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";

function Notifications() {
  useHydrateUserContext();
  const [enabled, setEnabled] = useState(false);
  const token = typeof window !== "undefined" ? readCookie("token") : undefined;
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(
    ["notifications"],
    async (p) => {
      const res = await axios
        .get<{
          notifications: {
            id: string;
            createdAt: Date;
            title: string;
            content: string;
            variant: NotificationVariants;
            urlToVisit: string;
          }[];
          next?: number;
        }>(`/api/notifications/get?take=${p.pageParam || 5}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .catch((err) => null);
      if (res === null) throw new Error("Unable to Fetch");

      return res.data;
    },
    {
      enabled,
      getNextPageParam: (lastPage, pages) => lastPage.next,
    }
  );

  useEffect(() => {
    if (readCookie("token")) setEnabled(true);
  }, []);

  const { push } = useRouter();

  if (enabled === false) return null;
  return (
    <Container size={450} className="mt-20">
      {status === "loading" ? (
        <p>Loading...</p>
      ) : status === "error" ? (
        <p>Error: {(error as Error)?.message}</p>
      ) : (
        <>
          {data?.pages.map((group, i) => (
            <Fragment key={i}>
              {group?.notifications?.map((n) => (
                <Notification
                  title={n.title}
                  className={n.urlToVisit ? "cursor-pointer" : ""}
                  onClick={() => push(n.urlToVisit)}
                  my="sm"
                  key={n.id}
                  color={
                    n.variant === "Error"
                      ? "red"
                      : n.variant === "Neutral"
                      ? "grape"
                      : "yellow"
                  }
                >
                  {n.content}
                </Notification>
              ))}
            </Fragment>
          ))}
          <div>
            <Button
              className={
                hasNextPage
                  ? "bg-[#1864ab] bg-opacity-80 hover:scale-110  duration-[110ms]"
                  : undefined
              }
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage
                ? "Loading more..."
                : hasNextPage
                ? "Load More"
                : null}
            </Button>
          </div>
          <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
        </>
      )}{" "}
    </Container>
  );
}

export default Notifications;
