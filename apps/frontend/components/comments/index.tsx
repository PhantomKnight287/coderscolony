/* eslint-disable react/no-children-prop */
import { PostAuthor } from "@components/post/forum-post/post-author";
import { Renderer } from "@components/renderer";
import { getMarkdownString } from "@helpers/showdown";
import { ForumPost } from "~types/forum-post";

type CommentProps = ForumPost["author"] & {
	createdAt: string;
	content?: string;
};

export default function Comment(props: CommentProps) {
	return (
		<>
			<PostAuthor {...props} content={null} />
			{props.content ? (
				<div className="ml-10">
					<Renderer children={getMarkdownString(props.content)} />
				</div>
			) : null}
		</>
	);
}
