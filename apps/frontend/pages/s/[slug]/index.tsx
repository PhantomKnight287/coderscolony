import { BlogPost } from "@components/blog/card";
import { outfit } from "@fonts/index";
import { imageResolver } from "@helpers/profile-url";
import { useHydrateUserContext } from "@hooks/hydrate/context";
import useCollapsedSidebar from "@hooks/sidebar/use-collapsed-sidebar";
import {
	Container,
	Image,
	SimpleGrid,
	Text,
	useMantineColorScheme,
} from "@mantine/core";
import clsx from "clsx";
import { GetStaticPaths, GetStaticProps } from "next";
import { useEffect } from "react";

interface Series {
	image: string;
	description: string | null;
	title: string;
	author: {
		username: string;
		name: string;
		profileImage: string;
	};
	slug: string;
	blogs: {
		id: string;
		description: string;
		title: string;
		author: {
			username: string;
			name: string;
			profileImage: string;
		};
		slug: string;
		createdAt: Date;
		ogImage: string;
	}[];
	createdAt: Date;
}

const SeriesInfo = ({ pageProps }: { pageProps: Series }) => {
	useCollapsedSidebar();
	useHydrateUserContext();
	const { colorScheme } = useMantineColorScheme();
	useEffect(() => {
		(window as any).props = pageProps;
	}, []);

	return (
		<Container>
			<Image
				src={imageResolver(pageProps.image)}
				style={{
					objectFit: "cover",
					borderRadius: 0,
					display: "block",
					width: "100%",
				}}
				classNames={{
					image: "rounded-md",
				}}
				alt="Banner Image"
			/>
			<Text
				className={clsx("text-center mt-2 text-lg font-bold", {
					[outfit.className]: true,
					"text-gray-800 dark:text-gray-200": colorScheme === "dark",
				})}
			>
				{pageProps.title}
			</Text>
			<Text
				className={clsx("text-center mt-2 text-base", {
					[outfit.className]: true,
				})}
			>
				{pageProps.description}
			</Text>
			<SimpleGrid
				cols={3}
				breakpoints={[
					{ minWidth: "sm", cols: 2 },
					{ minWidth: "md", cols: 3 },
					{ minWidth: 1200, cols: 3 },
				]}
			>
				{pageProps.blogs.map((blog) => (
					// @ts-ignore
					<BlogPost {...blog} key={blog.id} />
				))}
			</SimpleGrid>
		</Container>
	);
};

export default SeriesInfo;

export const getStaticPaths: GetStaticPaths = async () => {
	const data: { slug: string }[] = await (
		await fetch(`${process.env.API_URL}/static/series`)
	).json();
	return {
		paths: data.map((d) => ({ params: { slug: d.slug } })),
		fallback: "blocking",
	};
};

export const getStaticProps: GetStaticProps<Series> = async ({ params }) => {
	const { slug } = params as { slug: string };
	const data: Series = await (
		await fetch(`${process.env.API_URL}/series/${slug}`)
	).json();
	return { props: data };
};
