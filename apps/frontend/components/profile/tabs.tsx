import { Skeleton, Tabs } from "@mantine/core";
import { IconBrandGithub, IconPencil } from "@tabler/icons";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Blogs } from "./blog";

export function ProfileTabs() {
	const { query, isReady } = useRouter();
	useEffect(() => {}, [isReady, query.username]);

	return (
		<Tabs defaultValue={"blogs"}>
			<Tabs.List grow>
				<Tabs.Tab value="blogs" icon={<IconPencil size={18} />}>
					Blogs
				</Tabs.Tab>
				<Tabs.Tab value="repos" icon={<IconBrandGithub size={18} />}>
					Repositories
				</Tabs.Tab>
			</Tabs.List>
			<Tabs.Panel value="blogs" pt="xs">
				<Blogs />
			</Tabs.Panel>
		</Tabs>
	);
}
