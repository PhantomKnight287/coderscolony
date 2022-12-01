import { Blog } from "db";

export type Blogs = Partial<Blog> & {
  author: {
    username: string;
    name: string;
    profileImage: string;
    id: string;
  };
};
