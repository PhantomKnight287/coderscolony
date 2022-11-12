import { MetaTags } from "@components/meta";
import ForumPost from "@components/post/forum-post";
import { PostAuthor } from "@components/post/forum-post/post-author";
import { Renderer } from "@components/renderer";
import { getMarkdownString } from "@helpers/showdown";
import { useHydrateUserContext } from "@hooks/hydrate/context";
import { useSidebar } from "@hooks/sidebar";
import { Container } from "@mantine/core";
import axios from "axios";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { SinglePost } from "../../../../../types/forum-post";

const PostsPage: NextPage<{
  pageProps: InferGetServerSidePropsType<typeof getServerSideProps>;
}> = ({ pageProps }) => {
  useHydrateUserContext();
  const { setOpened } = useSidebar();

  useEffect(() => {
    setOpened(false);
    return () => setOpened(true);
  }, []);
  const { query } = useRouter();
  return (
    <Container>
      <MetaTags
        title={`${pageProps.post.author.name} on CodersColony: ${pageProps.post.content}`}
        description={pageProps.post.content}
      />
      <PostAuthor
        createdAt={pageProps.post.createdAt}
        {...pageProps.post.author}
        content={
          <p className="ml-2 text-[12px]" >
            Posted in{" "}
            <Link href={`/f/${query.name}`} className="font-semibold hover:underline" >{pageProps.post.Forums.name}</Link>
          </p>
        }
      />
      <div className="ml-10">
        <Renderer>{getMarkdownString(pageProps.post.content)}</Renderer>
      </div>
    </Container>
  );
};

export default PostsPage;

export const getServerSideProps: GetServerSideProps<SinglePost> = async ({
  query,
  req: { cookies, headers },
}) => {
  const token = cookies["token"];
  const header: Record<string, string> = {};
  if (token) header.authorization = `Bearer ${token}`;
  const data = await axios
    .get(
      `${process.env.NODE_ENV !== "production" ? "http" : "https"}://${
        headers.host
      }/api/forums/posts/${query.name}/${query.slug}`,
      { headers: header }
    )
    .then((d) => d.data)
    .catch((err) => null);
  if (data === null)
    return {
      redirect: {
        destination: `/f/${query.name}`,
        permanent: false,
      },
    };
  return {
    props: data,
  };
};
