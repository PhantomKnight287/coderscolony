export interface ForumPost {
	createdAt: string;
	id: string;
	slug: string;
	author: {
		username: string;
		name: string;
		profileImage: string;
	};
	content: string;
}

export interface SinglePost {
	post: {
		slug: string;
		id: string;
		content: string;
		Forums: {
			name: string;
		};
		createdAt: string;
		author: {
			id: string;
			name: string;
			username: string;
			profileImage: string;
		};
		likedBy: number;
		liked: boolean;
	};
	userInfo?: {
		isAdmin: boolean;
		isAuthor: boolean;
		isModerator: boolean;
	};
}
