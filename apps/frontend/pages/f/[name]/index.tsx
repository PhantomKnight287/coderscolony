import { MetaTags } from "@components/meta";
import { readCookie } from "@helpers/cookies";
import { useHydrateUserContext } from "@hooks/hydrate/context";
import { useUser } from "@hooks/user";
import {
  Anchor,
  Button,
  Image,
  Loader,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { ForumMemberRoles } from "db";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";
import styles from "../../../styles/dynamic-forum-page.module.scss";
import { IconCalendar, IconUsers } from "@tabler/icons";
import dayjs from "dayjs";
import { monthNames } from "../../../constants/months";
import { numberWithCommas } from "@helpers/number";
import { ForumSidebar } from "@components/sidebar/forum";
import { useIntersection } from "@mantine/hooks";
import dynamic from "next/dynamic";

const Editor = dynamic(
  () => import("../../../components/editor").then((d) => d.Editor),
  {
    // Disable during server side rendering
    ssr: false,

    // Render anything as fallback on server, e.g. loader or html content without editor
    loading: () => null,
  }
);

interface ApiData {
  bannerImage: null | string;
  createdAt: string;
  description: string;
  name: string;
  profileImage: null | string;
  forumMembers: number;
  urlSlug: string;
  moderators: {
    role: "MODERATOR";
    user: {
      username: string;
      profileImage: string;
      name: string;
    };
  }[];
  joined?: boolean;
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
  pageProps: InferGetServerSidePropsType<typeof getServerSideProps>;
}) => {
  useHydrateUserContext();
  const { query, isReady,replace } = useRouter();
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
          posts: {
            createdAt: Date;
            id: string;
            slug: string;
            author: { username: true; name: true; profileImage: true };
            content: string;
          }[];
          next?: number;
        }>(`/api/forums/${query.name}/posts?take=${p.pageParam || 5}`)
        .catch((err) => null);
      if (res === null) throw new Error("Unable to Fetch");

      return res.data;
    },
    {
      getNextPageParam: (lastPage, pages) => lastPage.next,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
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
    const forumSlug = query.name
    if(!forumSlug) return replace("/404")
    axios.post(`/api/forums/posts/${forumSlug}/create`,{content,slug})
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
    fetchNextPage();
  }, [entry?.isIntersecting]);

  const [content, setContent] = useState("");

  if (data === undefined)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader variant="dots" />
      </div>
    );

  return (
    <div className="flex">
      <MetaTags
        description={data.description}
        title={`${data.name} | Coders Colony`}
        ogImage={
          !data.profileImage
            ? `https://avatars.dicebear.com/api/big-smile/${data.urlSlug}.png`
            : data.profileImage.startsWith("https:///avatars.dicebear.com")
            ? data.profileImage
            : `/images/${data.profileImage}`
        }
      />
      <div className="flex-[0.75] mr-4">
        <div className="flex flex-row flex-wrap items-center justify-start border-b-[1px] border-[#2c2c2c] pb-4">
          <div>
            <Image
              src={
                !data.profileImage
                  ? `https://avatars.dicebear.com/api/big-smile/${data.urlSlug}.png`
                  : data.profileImage.startsWith(
                      "https:///avatars.dicebear.com"
                    )
                  ? data.profileImage
                  : `/images/${data.profileImage}`
              }
              styles={{
                image: {
                  maxHeight: "120px",
                  maxWidth: "120px",
                  minHeight: "90px",
                  minWidth: "90px",
                },
              }}
              radius={"md"}
            />
          </div>
          <div className="mx-auto">
            <h1
              style={{
                color: colorScheme === "dark" ? "#ffffff" : "#202021",
              }}
            >
              {data.name}
            </h1>
            <p
              className={`${styles.description} ${
                colorScheme === "dark" ? "text-[#d4d4d4]" : ""
              } `}
            >
              {data.description}
            </p>
            <div className="flex flex-row flex-wrap mt-2 items-center justify-evenly">
              <div className="flex flex-row items-center text-[13px]">
                <IconCalendar size={14} className="mr-2" />
                <div
                  style={{
                    color: colorScheme === "dark" ? "#999999" : "unset",
                  }}
                >
                  Created {monthNames[dayjs(data.createdAt).month()]}{" "}
                  {dayjs(data.createdAt).year()}
                </div>
              </div>
              <div className="flex flex-row items-center text-[13px]">
                <IconUsers size={14} className="mr-2" />
                <div
                  style={{
                    color: colorScheme === "dark" ? "#999999" : "unset",
                  }}
                >
                  {numberWithCommas(data.forumMembers)}{" "}
                  {data.forumMembers > 1 ? "Members" : "Member"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <Editor content={content} setContent={setContent} />
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
                    <p key={p_.id}>{p_.id}</p>
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
                disabled={!hasNextPage || isFetchingNextPage}
              >
                Load More
              </Button>
            ) : null}
          </div>
          <div>
            {isFetching && !isFetchingNextPage ? (
              "Fetching..."
            ) : (
              <p className="text-center text-sm mt-4">No Posts Found.</p>
            )}
          </div>
          <div ref={ref}>
            <Text weight={700}></Text>
          </div>
        </div>
      </div>
      <div className="flex-[0.15] lg:border-l-[1px] border-[#2c2c2c] hidden lg:block h-[100vh]">
        <ForumSidebar admins={data.admins} moderators={data.moderators} />
      </div>
    </div>
  );
};

export default Forum;

export const getServerSideProps: GetServerSideProps<ApiData> = async ({
  query,
  req: { cookies, headers },
}) => {
  const token = cookies["token"];
  const header: Record<string, string> = {};
  if (token) header.authorization = `Bearer ${token}`;
  const data = await axios
    .get(
      token
        ? `${process.env.NODE_ENV !== "production" ? "http" : "https"}://${
            headers.host
          }/api/forums/${query.name}/authenticated`
        : `${process.env.NODE_ENV !== "production" ? "http" : "https"}://${
            headers.host
          }/api/forums/${query.name}`,
      {
        headers: header,
      }
    )
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
