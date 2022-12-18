import { Box, SelectItemProps } from "@mantine/core";
import { ComponentPropsWithoutRef, forwardRef } from "react";
import { icons } from "./value";

interface ItemProps extends ComponentPropsWithoutRef<"div"> {
	icon: keyof typeof icons;
	label: string;
	color: string;
}

export const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
	({ label, icon, color, ...others }, ref) => {
		const Icon = icons[icon];
		return (
			<div
				ref={ref}
				{...others}
				style={{
					backgroundColor: color,
				}}
			>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
					}}
				>
					<Box mr={10}>{Icon ? <Icon /> : null}</Box>
					<div>{label}</div>
				</Box>
			</div>
		);
	}
);

SelectItem.displayName = "SelectItem";
