import { Container as C, ContainerProps } from "@mantine/core";

export function Container(props: Partial<ContainerProps>) {
	return (
		<C {...props} className={`${props.className} mt-20`}>
			{props.children}
		</C>
	);
}
