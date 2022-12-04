import axios from "axios";

interface CreateBlogProps {
	title: string;
	content: string;
	tags?: string[];
	ogImage?: string;
	token: string;
	description: string;
}
export async function createBlog(props: CreateBlogProps) {
	const { content, title, token, ogImage, tags, description } = props;

	return axios.post<{ slug: string }>(
		"/api/blogs/create",
		{
			title,
			content,
			ogImage,
			tags: tags || [],
			description,
		},
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);
}
