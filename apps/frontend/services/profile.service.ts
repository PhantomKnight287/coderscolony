import axios from "axios";

interface BaseProps {
	/**
	 * Authentication Token
	 */
	token: string;
}

interface isFollowableProps extends BaseProps {
	/**
	 * Username
	 */
	username: string;
}

export async function isFollowable({ token, username }: isFollowableProps) {
	return axios.get<{ followable: boolean }>(`/api/follow/user/${username}`, {
		headers: {
			authorization: `Bearer ${token}`,
		},
	});
}

export async function followUser({ token, username }: isFollowableProps) {
	return axios.post<{ followable: boolean }>(
		`/api/follow/user/${username}`,
		undefined,
		{
			headers: {
				authorization: `Bearer ${token}`,
			},
		}
	);
}
export async function unfollowUser({ token, username }: isFollowableProps) {
	return axios.delete<{ followable: boolean }>(
		`/api/follow/user/${username}`,
		{
			headers: {
				authorization: `Bearer ${token}`,
			},
		}
	);
}
