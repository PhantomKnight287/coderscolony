import axios from "axios";

interface LikeProps {
	/**
	 * Slug of the Forum
	 */
	slug: string;
	/**
	 * Slug of the Post
	 */
	postSlug: string;
	/**
	 * Authentication Token of the User
	 */
	token: string;
}

export async function likePost({ postSlug, slug, token }: LikeProps) {
	const data = await axios
		.post(`/api/forum/${slug}/post/${postSlug}/like`, undefined, {
			headers: {
				authorization: `Bearer ${token}`,
			},
		})
		.catch((err) => err.response?.data?.message || "An Error Occured");
	if (typeof data === "string") return data;
	return null;
}
