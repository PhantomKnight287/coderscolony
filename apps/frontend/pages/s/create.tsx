import { Container } from "@components/container";
import useCollapsedSidebar from "@hooks/sidebar/use-collapsed-sidebar";
import { useUser } from "@hooks/user";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { spaceGrotest } from "@fonts/index";
import { Text, Title } from "@mantine/core";
import clsx from "clsx";
import { useHydrateUserContext } from "@hooks/hydrate/context";

export default function CreateSeries() {
	useCollapsedSidebar();
	const { id } = useUser();
	const { isReady, push } = useRouter();
	useHydrateUserContext();
	useEffect(() => {
		if (isReady && !id) push("/auth/login");
	}, [isReady, id]);

	return (
		<Container>
			<Title
				className={clsx("text-center", {
					[spaceGrotest.className]: true,
				})}
			>
				Create Series
			</Title>
		</Container>
	);
}
