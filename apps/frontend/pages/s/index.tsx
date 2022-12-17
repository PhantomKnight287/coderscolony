import { Container } from "@components/container";
import { MetaTags } from "@components/meta";
import useCollapsedSidebar from "@hooks/sidebar/use-collapsed-sidebar";

export default function Series() {
	useCollapsedSidebar();
	return (
		<>
			<MetaTags
				description="View Series of Blogs on Coders Colony"
				title="Series | CodersColony"
			/>
			{/* <Container>
				Lorem ipsum dolor sit amet consectetur, adipisicing elit. Earum,
				laborum? Illo, dolore provident vitae repellat assumenda
				veritatis architecto quisquam natus?
			</Container> */}
		</>
	);
}
