import { Text, TextProps } from "@mantine/core";
import { FC, ReactNode } from "react";
import styles from "./label.module.scss";

const Label: FC<
	{ required?: boolean; children: ReactNode } & Partial<TextProps>
> = ({ children, required }) => {
	return (
		<div>
			<Text
				size={14}
				sx={{
					fontWeight: "lighter",
					marginTop: 12,
					marginBottom: 3,
					display: "inline",
				}}
			>
				{children}{" "}
			</Text>
			{required ? <span className={styles.asterisk}>*</span> : null}
		</div>
	);
};

export default Label;
