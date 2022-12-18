import { outfit } from "@fonts/index";
import { Container, Paper, Spoiler, Text } from "@mantine/core";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { Blogs } from "~types/blog";

type S_ = Blogs["Series"];

interface SeriesBannerProps extends S_ {}

export default function SeriesBanner(props: SeriesBannerProps) {
	const { query } = useRouter();
	return (
		<>
			<Container>
				<div className="flex flex-col items-center justify-center">
					<Text
						className={clsx("text-base", {
							[outfit.className]: true,
						})}
					>
						This Blog is part of a series:
						<Link
							className="text-blue-500 ml-4 hover:underline"
							href={`/s/${props.slug}`}
						>
							{props.title}
						</Link>
					</Text>
					{props.blogs.length > 1 ? (
						<Spoiler
							maxHeight={150}
							showLabel="Show more"
							hideLabel="Hide"
							className={clsx("mt-3 text-lg w-full", {
								[outfit.className]: true,
							})}
						>
							More blogs in this series:
							<div className="flex flex-col items-center justify-center">
								{props.blogs.map((blog) => {
									if (blog.slug === query.slug) return null;
									return (
										<Link
											className="hover:underline w-full"
											href={`/u/${blog.author.username}/blog/${blog.slug}`}
											key={blog.id}
										>
											<Paper
												p="md"
												withBorder
												className={clsx("w-full")}
												radius="md"
											>
												{blog.title}
												<Text
													size="md"
													color="dimmed"
													lineClamp={2}
												>
													{blog.description}
												</Text>
											</Paper>
										</Link>
									);
								})}
							</div>
						</Spoiler>
					) : null}
				</div>
			</Container>
		</>
	);
}
