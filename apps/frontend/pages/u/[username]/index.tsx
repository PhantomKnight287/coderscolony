import { MetaTags } from "@components/meta";
import { useHydrateUserContext } from "@hooks/hydrate/context";
import { useSidebar } from "@hooks/sidebar";
import {
  Avatar,
  Container,
  createStyles,
  Image,
  Skeleton,
  useMantineColorScheme,
} from "@mantine/core";
import clsx from "clsx";
import { User } from "db";
import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import styles from "@styles/username.module.scss";
import { fetchProfile } from "@services/profile-actions";
import { readCookie } from "@helpers/cookies";
import { useUserDispatch } from "@hooks/user";
import { ProfileTabs } from "@components/profile/tabs";
import { imageResolver } from "@helpers/profile-url";

const useStyles = createStyles((theme) => ({
  image: {
    objectFit: "cover",
    maxHeight: "300px",
  },
}));

const UsernamePage: NextPage<{
  pageProps: InferGetStaticPropsType<typeof getStaticProps>;
}> = ({ pageProps }) => {
  const { colorScheme } = useMantineColorScheme();
  const { opened, setOpened } = useSidebar();
  const { asPath } = useRouter();
  const [user, setUser] = useState(pageProps);
  const { classes } = useStyles();
  useEffect(() => {
    if (opened === true) {
      return setOpened(false);
    }
    return () => setOpened(true);
  }, [opened]);

  useHydrateUserContext();

  const setGlobalUser = useUserDispatch();
  async function fetchProfileAndUpdateState() {
    const data = await fetchProfile(pageProps.username!, readCookie("token"));
    if (data.error === false) {
      delete data.error;
      setUser(data);
      setGlobalUser({ payload: data, type: "SetUser" });
    }
  }
  const ref = useRef<HTMLFormElement>();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <>
      <MetaTags
        description={`${user.name} on CodersColony`}
        title={`${user.name} | @${user.username} `}
      />
      <Container>
        {user.bannerColor || user.bannerImage ? (
          <div className="flex flex-col items-center justify-center">
            {user.bannerImage ? (
              <Skeleton visible={!imageLoaded}>
                <Image
                  classNames={{
                    image: classes.image,
                  }}
                  onLoad={() => setImageLoaded(true)}
                  src={imageResolver(user.bannerImage)}
                  className="rounded-md overflow-hidden object-cover"
                />
              </Skeleton>
            ) : user.bannerColor ? (
              <div
                className="rounded-md overflow-hidden max-h-[300px] w-[100%]"
                style={{
                  backgroundColor: user.bannerColor,
                }}
              ></div>
            ) : null}
          </div>
        ) : null}
        <div className="w-max h-max mt-[-5rem] flex items-center justify-center">
          <Avatar
            src={
              user.profileImage
                ? user.profileImage.startsWith("https://avatar.dicebar")
                  ? user.profileImage
                  : `/images/${user.profileImage}`
                : `https://avatars.dicebear.com/api/big-smile/${user.username}.svg`
            }
            size={160}
            radius={80}
            className="bg-[#171718] border-4 ml-[20px] border-[#171718]"
          />
        </div>
        <div className="ml-[20px]">
          <div className="flex items-center text-[16px] mt-5 font-[700] leading-[24px]">
            <div className="gap-[4px] flex items-center font-[700]">
              <p
                className={clsx("mr-[4px] ml-3", {
                  "text-white": colorScheme === "dark",
                })}
              >
                {user.name}
              </p>
            </div>
          </div>
          <div className="flex flex-row items-center justify-start ml-3 gap-8">
            <span
              className={clsx("text-[13px] leading-[18px]", {
                "text-gray-500": colorScheme === "dark",
                "text-[#666666]": colorScheme === "light",
              })}
            >
              @{user.username}
            </span>
          </div>
          {user.oneLiner ? (
            <p
              className={clsx("break-words ml-3 mt-4 leading-[24px]", {
                "text-white": colorScheme === "dark",
              })}
            >
              {user.oneLiner}
            </p>
          ) : null}
          <div className="ml-3 mt-5 flex items-center">
            <div className="flex-wrap items-center flex gap-[8px]">
              <Link href={`${asPath}/followers`}>
                <span
                  className={clsx(
                    "text-[13px] leading-[18px] hover:underline",
                    {
                      "text-gray-300": colorScheme === "dark",
                      "text-[#666666]": colorScheme === "light",
                    }
                  )}
                >
                  {user.followers} Followers
                </span>
              </Link>
              <span
                className={clsx(
                  `text-[13px] leading-[18px] ${styles.following}`,
                  {
                    "text-gray-300": colorScheme === "dark",
                    "text-[#666666]": colorScheme === "light",
                  }
                )}
              >
                <Link href={`${asPath}/following`} className="hover:underline ">
                  {user.following} Following
                </Link>
              </span>
            </div>
          </div>
        </div>
        <div className="mt-10">
          {typeof window !== "undefined" ? <ProfileTabs /> : null}
        </div>
      </Container>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const usernames: { username: string }[] = await (
    await fetch(`${process.env.API_URL}/static/profiles`)
  ).json();
  return {
    fallback: "blocking",
    paths: usernames.map((username) => ({ params: username })),
  };
};

export const getStaticProps: GetStaticProps<
  Partial<User & { edit: boolean; followers: number; following: number }>
> = async ({ params }) => {
  const data = await fetch(
    `${process.env.API_URL}/profile/${params!.username}`
  ).catch(() => null);
  if (data === null) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
  if (data.status == 404) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
  return {
    props: {
      ...(await data.json()),
    },
  };
};

export default UsernamePage;
