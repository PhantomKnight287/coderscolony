import { Box, CloseButton, MultiSelectValueProps } from "@mantine/core";
import {
	IconAlien,
	IconArticle,
	IconAtom,
	IconBat,
	IconBrandAmongus,
	IconBrandAndroid,
	IconBrandAngular,
	IconCode,
	IconHeart,
	TablerIcon,
} from "@tabler/icons";

export const icons: Record<string, TablerIcon> = {
	heart: IconHeart,
	code: IconCode,
	alien: IconAlien,
	article: IconArticle,
	atom: IconAtom,
	bat: IconBat,
	amongus: IconBrandAmongus,
	android: IconBrandAndroid,
	angular: IconBrandAngular,
};

export function Value({
	icon,
	label,
	onRemove,
	classNames,
	color,
	...others
}: MultiSelectValueProps & { icon: keyof typeof icons; color: string }) {
	const Icon = icons[icon];
	return (
		<div {...others}>
			<Box
				sx={(theme) => ({
					display: "flex",
					cursor: "default",
					alignItems: "center",
					backgroundColor: color
						? color
						: theme.colorScheme === "dark"
						? theme.colors.dark[7]
						: theme.white,
					border: `1px solid ${
						theme.colorScheme === "dark"
							? theme.colors.dark[7]
							: theme.colors.gray[4]
					}`,
					paddingLeft: 10,
					borderRadius: 4,
				})}
			>
				<Box mr={10}>{Icon ? <Icon /> : null}</Box>
				<Box sx={{ lineHeight: 1, fontSize: 12 }}>{label}</Box>
				<CloseButton
					onMouseDown={onRemove}
					variant="transparent"
					size={22}
					iconSize={14}
					tabIndex={-1}
				/>
			</Box>
		</div>
	);
}
