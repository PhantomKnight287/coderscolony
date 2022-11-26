import { MetaTags } from "@components/meta";
import ForumPost from "@components/post/forum-post";
import { PostAuthor } from "@components/post/forum-post/post-author";
import { Renderer } from "@components/renderer";
import { PostToolBar } from "@components/toolbar/per-post";
import { readCookie } from "@helpers/cookies";
import { getMarkdownString } from "@helpers/showdown";
import { useHydrateUserContext } from "@hooks/hydrate/context";
import { useSidebar } from "@hooks/sidebar";
import { Container, Loader, LoadingOverlay } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { likePost } from "@services/post-actions";
import { IconArrowLeft } from "@tabler/icons";
import axios from "axios";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SinglePost } from "../../../../../types/forum-post";

const PostsPage: NextPage<{
  pageProps: InferGetServerSidePropsType<typeof getServerSideProps>;
}> = ({ pageProps }) => {
  useHydrateUserContext();
  const { setOpened, opened } = useSidebar();
  const { query } = useRouter();
  const [likes, setLikes] = useState(pageProps.post.likedBy || 0);
  useEffect(() => {
    if (opened == false) {
      // setOpened(false);
    }
    return () => setOpened(true);
  }, []);
  return (
    <Container>
      <MetaTags
        title={`${pageProps.post.author.name} on CodersColony: ${pageProps.post.content}`}
        description={pageProps.post.content}
      />
      <Link href={`/f/${query.name}`}>
        <div className="mb-5 flex flex-row items-center gap-1 hover:underline">
          <IconArrowLeft size={18} />
          Go Back
        </div>
      </Link>
      <PostAuthor
        createdAt={pageProps.post.createdAt}
        {...pageProps.post.author}
        content={
          <p className="ml-2 text-[12px]">
            Posted in{" "}
            <Link
              href={`/f/${query.name}`}
              className="font-semibold hover:underline"
            >
              {pageProps.post.Forums.name}
            </Link>
          </p>
        }
        showMenu={
          pageProps?.userInfo?.isAdmin ||
          pageProps?.userInfo?.isModerator ||
          pageProps?.userInfo?.isAuthor ||
          false
        }
        deletePost={() => {}}
      />
      <div className="ml-10 pt-4">
        {typeof window != "undefined" ? (
          <Renderer>{getMarkdownString(pageProps.post.content)}</Renderer>
        ) : (
          <Loader color={"green"} size="md" />
        )}
      </div>

      <PostToolBar
        linkToCopy={typeof window != "undefined" ? window.location.href : ""}
        likePost={async () =>
          await likePost({
            postSlug: query.slug! as string,
            slug: query.name! as string,
            token: readCookie("token")!,
          }).then((data) => {
            if (data == null) {
              return setLikes((o) => o + 1);
            }
            return showNotification({
              message: data,
              color: "red",
            });
          })
        }
        likes={likes}
      />
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
