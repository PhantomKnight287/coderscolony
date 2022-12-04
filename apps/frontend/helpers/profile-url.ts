export const profileImageResolver = ({
	profileURL,
	username,
}: {
	profileURL: string;
	username: string;
}) => {
	return profileURL
		? profileURL.startsWith("https://avatar.dicebar")
			? profileURL
			: `/images/${profileURL}`
		: `https://avatars.dicebear.com/api/big-smile/${username}.svg`;
};

export const imageResolver = (url: string) => {
	return `/images/${url}`;
};
