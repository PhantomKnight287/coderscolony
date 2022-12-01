import { MetaTags } from "@components/meta";
import { Renderer } from "@components/renderer";
import { imageResolver, profileImageResolver } from "@helpers/profile-url";
import { useHydrateUserContext } from "@hooks/hydrate/context";
import { useSidebar } from "@hooks/sidebar";
import {
  Avatar,
  Container,
  Divider,
  Group,
  Image,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { useHydrate } from "@tanstack/react-query";
import axios from "axios";
import clsx from "clsx";
import dayjs from "dayjs";
import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import { useEffect } from "react";
import { Blogs } from "~types/blog";
import { monthNames } from "../../../../../constants/months";

const BlogPage: NextPage<{
  pageProps: InferGetStaticPropsType<typeof getStaticProps>;
}> = ({ pageProps }) => {
  const { colorScheme } = useMantineColorScheme();
  const { opened, setOpened } = useSidebar();
  useHydrateUserContext();


  useEffect(() => {
    if (opened) return setOpened(false);
    return () => setOpened(true);
  }, [opened]);

  return (
    <>
      <MetaTags
        title={pageProps.title!}
        description={pageProps.description!}
        ogImage={imageResolver(pageProps.ogImage!)}
      />

      <Container>
        <Image
          src={imageResolver(pageProps.ogImage!)}
          style={{
            objectFit: "cover",
            borderRadius: 0,
            display: "block",
            width: "100%",
          }}
        />
        <Title
          className={clsx("", {
            "text-white": colorScheme === "dark",
          })}
        >
          {pageProps.title}
        </Title>
        <Group mt="md">
          <Avatar
            src={profileImageResolver({
              profileURL: pageProps.author.profileImage,
              username: pageProps.author.username,
            })}
            size="md"
            radius="xl"
          />
          <div className="gap-[2px] flex flex-row">
            <Text>{pageProps.author.name}</Text>
            <span className="mx-2">/</span>
            <Text>
              {dayjs(pageProps.createdAt).get("date")}{" "}
              {monthNames[dayjs(pageProps.createdAt).get("month")]}{" "}
              {dayjs(pageProps.createdAt).get("year")}
            </Text>
          </div>
        </Group>
        <Divider mt="lg" />
        {typeof window !== "undefined" ? (
          <Renderer children={pageProps.content!} />
        ) : null}
      </Container>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const blogs: { slug: string; author: { username: string } }[] = await (
    await axios.get(`${process.env.API_URL}/blogs/generate/static`)
  ).data;
  return {
    paths: blogs.map((blog) => ({
      params: {
        username: blog.author.username,
        slug: blog.slug,
      },
    })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<Blogs> = async ({ params }) => {
  const { slug, username } = params as { username: string; slug: string };
  const data = await axios
    .get(`${process.env.API_URL}/blogs/${username}/blog/${slug}`)
    .catch((err) => {
      console.log(err);
      return null;
    });
  if (data === null)
    return {
      notFound: true,
    };
  return {
    props: { ...data.data },
  };
};

export default BlogPage;
