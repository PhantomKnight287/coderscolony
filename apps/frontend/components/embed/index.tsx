import { isValidURL } from "@helpers/url";
import useDebounce from "@hooks/debounce";
import {
	Avatar,
	Card,
	Divider,
	Group,
	Image,
	Skeleton,
	Text,
	useMantineColorScheme,
} from "@mantine/core";
import axios, { CancelToken } from "axios";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { MetaData } from "~types/metadata";

function Embed(props: any) {
	const [metaData, setMetaData] = useState<MetaData | null>(null);
	const { colorScheme } = useMantineColorScheme();
	useDebounce(
		() => {
			const token = axios.CancelToken.source();
			fetchUrlMetaData(props.href, token.token);
			return () => {
				token.cancel();
			};
		},
		[props.href],
		300
	);
	async function fetchUrlMetaData(url: string, cancelToken: CancelToken) {
		if (!isValidURL(url)) return;
		axios
			.post(
				"/api/metadata",
				{ urls: [url] },
				{
					cancelToken,
					timeout: 5000,
				}
			)
			.then((d) => d.data)
			.then((d) => {
				setMetaData(d[url]);
			})
			.catch(() => {
				setMetaData(null);
			});
	}

	//   useEffect(() => {
	//     const token = axios.CancelToken.source();
	//     fetchUrlMetaData(props.href, token.token);
	//     return () => {
	//       token.cancel();
	//     };
	//   }, [props.href]);
	return (
		<>
			<a
				{...props}
				target="_blank"
				rel="noreferrer noopener"
				className="hover:underline text-blue-500"
			/>
			{metaData ? (
				<Card
					withBorder
					radius={"lg"}
					className={clsx("", {
						"max-w-[550px]": metaData.image,
						"max-w-fit": !metaData.image,
					})}
					mt="sm"
				>
					{metaData.image ? (
						<Card.Section>
							<Image
								src={metaData.image}
								className="aspect-square max-h-[300px]"
							/>
						</Card.Section>
					) : null}

					<Card.Section p="md" pt={metaData.image ? "0" : undefined}>
						<Skeleton visible={typeof window === "undefined"}>
							{isValidURL(props.href) ? (
								<Text color="dimmed" className="word-break">
									{new URL(props.href).hostname}
								</Text>
							) : null}
							<Text
								className={clsx("", {
									"text-white": colorScheme === "dark",
								})}
							>
								{metaData.title}
							</Text>
							<Text color="dimmed" className="word-break">
								{metaData.description}
							</Text>
						</Skeleton>
					</Card.Section>
				</Card>
			) : null}
		</>
	);
}

export default Embed;
