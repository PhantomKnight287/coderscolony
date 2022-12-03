import React, { useState } from "react";
import { Center, Container, Group, Image, Skeleton } from "@mantine/core";
import { MetaTags } from "@components/meta";
import useCollapsedSidebar from "@hooks/sidebar/use-collapsed-sidebar";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { readCookie } from "@helpers/cookies";
import { Forums } from "db";
import { imageResolver } from "@helpers/profile-url";

function EditForum() {
  const { query, replace, push, isReady } = useRouter();

  async function fetcher(): Promise<Partial<Forums> | null | undefined> {
    const data = await fetch(`/api/forum-edit/${query.name}/details`, {
      headers: {
        authorization: `Bearer ${readCookie("token")}`,
      },
    });
    if (data.ok) {
      return await data.json();
    }
    if (data.status === 404) return void replace("/404");
    if (data.status === 401) return void push(`/f/${query.name}`);
    if (data.status == 403) return void push(`/f/${query.name}`);
    return null;
  }

  useCollapsedSidebar();
  const { data, refetch, error, isLoading } = useQuery({
    queryKey: ["forum"],
    queryFn: fetcher,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    enabled: typeof window !== "undefined" && isReady,
  });
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <>
      <MetaTags title="Edit Forum" description="Edit Forum" />
      <Container>
        <Skeleton visible={isLoading && data} className="h-[50vh]">
          <Group position="center">
            {data?.bannerImage ? (
              <Skeleton visible={!imageLoaded}>
                <Image
                  classNames={{
                    image: "object-cover max-h-[300px]",
                  }}
                  onLoad={() => setImageLoaded(true)}
                  src={imageResolver(data.bannerImage)}
                  className="rounded-md overflow-hidden object-cover"
                />
              </Skeleton>
            ) : data?.bannerColor ? (
              <div
                className="rounded-md overflow-hidden max-h-[300px] h-[300px] w-[100%]"
                style={{
                  backgroundColor: data?.bannerColor,
                }}
              ></div>
            ) : null}
          </Group>
        </Skeleton>
      </Container>
    </>
  );
}

export default EditForum;
