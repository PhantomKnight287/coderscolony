import { Series as S, User as author } from "db";
export type Series = S & {
	author: Pick<author, "username" | "name" | "profileImage">;
	blogs: number;
};

export type Serieses = {
	series: Series[];
	next?: number;
};
