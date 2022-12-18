import axios from "axios";

interface CreateBlogProps {
	title: string;
	content: string;
	tags?: string[];
	ogImage?: string | null;
	token: string;
	description: string;
	seriesId?: string | null;
}
export async function createBlog(props: CreateBlogProps) {
	const { content, title, token, ogImage, tags, description, seriesId } =
		props;

	return axios.post<{ slug: string }>(
		"/api/blogs/create",
		{
			title,
			content,
			ogImage,
			tags: tags || [],
			description,
			seriesId,
		},
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);
}
