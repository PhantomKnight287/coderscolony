import axios from "axios";

interface BaseProps {
	token: string;
}

interface CreateSeriesProps extends BaseProps {
	title: string;
	description: string;
	image?: string | null;
}

export async function createSeries({
	token,
	title,
	description,
	image,
}: CreateSeriesProps) {
	return axios.post(
		`/api/series/create`,
		{ title, description, image },
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);
}

export async function fetchSeriesByUsername(username: string) {
	return axios.get<{ id: string; title: string }[]>(
		`/api/series/user/${username}`
	);
}
