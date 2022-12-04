const allData = {
	title: "Title of page or article",
	description: "Description of page or article",
	language: "Language of page or article",
	type: "Page type",
	url: "URL of page",
	provider: "Page provider",
	keywords: ["array", "of", "keywords"],
	section: "Section/Category of page",
	author: "Article author",
	published: 1605221765, // Date the article was published
	modified: 1605221765, // Date the article was modified
	robots: ["array", "for", "robots"],
	copyright: "Page copyright",
	email: "Contact email",
	twitter: "Twitter handle",
	facebook: "Facebook account id",
	image: "Image URL",
	icon: "Favicon URL",
	video: "Video URL",
	audio: "Audio URL",
};

export type MetaData = Partial<typeof allData>;
