import ForumMemberCard from "@components/cards/forum-members";
import { Collapsible } from "@components/collapsible";
import { MetaTags } from "@components/meta";
import { readCookie } from "@helpers/cookies";
import { useHydrateUserContext } from "@hooks/hydrate/context";
import { useSidebar } from "@hooks/sidebar";
import { useUser } from "@hooks/user";
import { Collapse, Image, Loader, useMantineColorScheme } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { ForumMemberRoles } from "db";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../../../styles/dynamic-forum-page.module.scss";
import { IconCalendar, IconUsers } from "@tabler/icons";
import dayjs from "dayjs";
import { monthNames } from "../../../constants/months";
import { numberWithCommas } from "@helpers/number";

const Forum = ({
  pageProps,
}: {
  pageProps: InferGetServerSidePropsType<typeof getServerSideProps>;
}) => {
  useHydrateUserContext();
  const { query, isReady } = useRouter();
  const { id } = useUser();
  const [data, setData] = useState<
    | {
        bannerImage: null | string;
        createdAt: string;
        description: string;
        name: string;
        profileImage: null | string;
        forumMembers: number;
        urlSlug: string;
        moderators: [];
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
    | undefined
  >(pageProps);
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
    }
  );
  const { colorScheme } = useMantineColorScheme();
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
      <div className="flex-[0.75]">
        <div className="flex flex-row flex-wrap items-center justify-evenly border-b-[1px] border-[#2c2c2c] pb-4 mr-4">
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
              sx={{
                maxHeight: "120px",
                maxWidth: "120px",
              }}
            />
          </div>
          <div>
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
      </div>
      <div className="flex-[0.15] lg:border-l-[1px] border-[#2c2c2c] hidden lg:block h-[100vh]">
        <Collapsible
          icon={null}
          label="Admins"
          initiallyOpened
          links={data.admins.map((d) => ({
            id: d.user.username,
            label: (
              <ForumMemberCard
                avatarURL={d.user.profileImage}
                name={d.user.name}
                username={d.user.username}
              />
            ),
            handler() {},
          }))}
        />
      </div>
    </div>
  );
};

export default Forum;

export const getServerSideProps: GetServerSideProps<{
  bannerImage: null | string;
  createdAt: string;
  description: string;
  name: string;
  profileImage: null | string;
  forumMembers: number;
  urlSlug: string;
  moderators: [];
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
}> = async ({ query, req: { cookies, headers } }) => {
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
  console.log(data.data);
  return {
    props: data.data as any,
  };
};
