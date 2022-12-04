import { readCookie } from "@helpers/cookies";
import { useUserDispatch } from "@hooks/user";
import axios from "axios";
import { User } from "db";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function useHydrateUserContext() {
	const dispatch = useUserDispatch();
	const { replace } = useRouter();

	function fetchProfile() {
		const cookie = readCookie("token");
		if (!cookie) return;
		axios
			.get<Exclude<User, "password">>("/api/auth/hydrate", {
				headers: {
					authorization: `Bearer ${cookie}`,
				},
			})
			.then((d) => d.data)
			.then((d) => {
				dispatch({
					type: "SetUser",
					payload: d,
				});
			})
			.catch((err) => {
				const header = err.response?.headers["X-Error"];
				if (!header) return;
				if (header)
					return replace(
						`/auth/login?message=${encodeURIComponent(
							"Session Expired, Please Login Again."
						)}`
					);
			});
	}

	useEffect(() => {
		fetchProfile();
	}, []);
	return fetchProfile;
}
