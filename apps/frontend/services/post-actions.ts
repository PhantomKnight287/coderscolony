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
		.then((_) => null)
		.catch((err) => err.response?.data?.message || "An Error Occured");
	if (typeof data === "string") return data;
	return null;
}

interface DislikeProps {
	/**
	 * Slug of the Forum
	 * @example "my-forum"
	 * @type {string}
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

export async function dislikePost({ postSlug, slug, token }: DislikeProps) {
	return await axios
		.delete(`/api/forum/${slug}/post/${postSlug}/like`, {
			headers: {
				authorization: `Bearer ${token}`,
			},
		})
		.then((_) => null)
		.catch((err) => err.response?.data?.message || "An Error Occured");
}
