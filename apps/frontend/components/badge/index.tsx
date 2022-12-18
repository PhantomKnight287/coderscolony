import { icons } from "@components/select/value";
import { Badge as B, BadgeProps, useMantineTheme } from "@mantine/core";

export const Badge = (props: BadgeProps & { icon: string }) => {
	const theme = useMantineTheme();
	const Icon = icons[props.icon];
	return (
		<B
			{...props}
			styles={{
				root: {
					backgroundColor: props.color,
					color:
						theme.colorScheme === "dark"
							? theme.white
							: theme.black,
				},
			}}
			leftSection={Icon ? <Icon /> : null}
		/>
	);
};
