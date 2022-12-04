import axios from "axios";

export async function UpdateBannerImage(
	url: string,
	username: string,
	token: string
) {
	const data = await axios
		.post(
			`/api/profile/${username}/update/banner-image`,
			{ url },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		)
		.catch((err) => ({
			message: err?.response?.data?.message || "An Error Occured",
			status: err.response?.status || 500,
		}));
	if ("status" in data) {
		return {
			error: true,
			...data,
		};
	}
	return {
		error: false,
		...(data as any).data,
	};
}
export async function RemoveBannerImage(username: string, token: string) {
	const data = await axios
		.post(
			`/api/profile/${username}/update/banner-image/remove`,
			undefined,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		)
		.catch((err) => ({
			message: err?.response?.data?.message || "An Error Occured",
			status: err.response?.status || 500,
		}));
	if ("status" in data) {
		return {
			error: true,
			...data,
		};
	}
	return {
		error: false,
		...(data as any).data,
	};
}

export async function fetchProfile(
	username: string,
	token: string | null | undefined
) {
	const headers: Record<any, string> = {};
	if (token) headers["Authorization"] = `Bearer ${token}`;
	const data = await axios
		.get(`/api/profile/${username}`, { headers: headers })
		.then((d) => d.data)
		.catch((err) => ({
			status: err?.response?.status || 500,
			message: err?.response?.data?.message || "An Error Occured",
		}));
	if ("status" in data) {
		return {
			error: true,
			...data,
		};
	}
	return {
		error: false,
		...data,
	};
}
export async function changeBannerColor(
	username: string,
	color: string,
	token: string
) {
	const data = await axios
		.post(
			`/api/profile/${username}/update/banner-color`,
			{ color },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		)
		.catch((err) => ({
			message: err?.response?.data?.message || "An Error Occured",
			status: err.response?.status || 500,
		}));
	if ("status" in data) {
		return {
			error: true,
			...data,
		};
	}
	return {
		error: false,
		...(data as any).data,
	};
}
export async function changeProfileImage(
	username: string,
	url: string,
	token: string
) {
	const data = await axios
		.post(
			`/api/profile/${username}/update/profile-image`,
			{ url },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		)
		.catch((err) => ({
			message: err?.response?.data?.message || "An Error Occured",
			status: err.response?.status || 500,
		}));
	if ("status" in data) {
		return {
			error: true,
			...data,
		};
	}
	return {
		error: false,
		...(data as any).data,
	};
}
export async function updateOneLiner(
	username: string,
	oneLiner: string,
	token: string
) {
	const data = await axios
		.post(
			`/api/profile/${username}/update/one-liner`,
			{ oneLiner },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		)
		.catch((err) => ({
			message: err?.response?.data?.message || "An Error Occured",
			status: err.response?.status || 500,
		}));
	if ("status" in data) {
		return {
			error: true,
			...data,
		};
	}
	return {
		error: false,
		...(data as any).data,
	};
}
export async function updateName(
	username: string,
	name: string,
	token: string
) {
	const data = await axios
		.post(
			`/api/profile/${username}/update/name`,
			{ name },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		)
		.catch((err) => ({
			message: err?.response?.data?.message || "An Error Occured",
			status: err.response?.status || 500,
		}));
	if ("status" in data) {
		return {
			error: true,
			...data,
		};
	}
	return {
		error: false,
		...(data as any).data,
	};
}
export async function updateProfile(data: any, token: string) {
	return axios.post("/api/profile/update", data, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
}
