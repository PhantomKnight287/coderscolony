import axios from "axios";

export async function isBlogEditable(token: string, slug: string) {
	return axios.get(`/api/editable/blog/${slug}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
}
