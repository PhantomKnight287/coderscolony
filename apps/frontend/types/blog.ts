import { Blog } from "db";

export type Blogs = Partial<Blog> & {
	author: {
		username: string;
		name: string;
		profileImage: string;
		id: string;
	};
	readTime: string;
	Series: {
		blogs: {
            id: string;
            createdAt: Date;
            slug: string;
            title: string;
            description: string;
            author: {
                username: string;
            };
        }[];
		id: string;
		createdAt: Date;
		slug: string;
		title: string;
	};
};
