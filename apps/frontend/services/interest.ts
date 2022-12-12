import axios from "axios";

interface Props {
	token: string;
	name: string;
	icon: string;
	color: string;
}

export async function createInterest({ color, icon, name, token }: Props) {
	return await axios.post(
		"/api/interests",
		{
			color,
			icon,
			name,
		},
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);
}

export async function fetchInterest() {
	return axios.get("/api/interests");
}
