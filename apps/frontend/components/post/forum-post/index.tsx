import { Renderer } from "@components/renderer";
import { getMarkdownString } from "@helpers/showdown";
import { Paper } from "@mantine/core";
import { useRouter } from "next/router";
import { memo } from "react";
import type { ForumPost } from "../../../types/forum-post";
import { PostAuthor } from "./post-author";
import styles from "./post.module.scss";

function ForumPost({ author, content, createdAt, id, slug }: ForumPost) {
	const { query, push } = useRouter();

	return (
		<Paper
			withBorder
			mt="xl"
			pt="md"
			p="md"
			className="cursor-pointer"
			onClick={() => push(`/f/${query.name}/post/${slug}`)}
		>
			<PostAuthor {...author} createdAt={createdAt} />
			<div className={`ml-10 ${styles.renderer}`}>
				<Renderer>{getMarkdownString(content)}</Renderer>
			</div>
		</Paper>
	);
}

export default memo(ForumPost);
