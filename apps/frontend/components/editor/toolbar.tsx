import { Tooltip } from "@mantine/core";
import { IconPhoto, IconSend } from "@tabler/icons";
import { Dispatch, SetStateAction } from "react";

interface Props {
	setOpened: Dispatch<SetStateAction<boolean>>;
	handler: () => void;
}

export const ToolBar = ({ setOpened, handler }: Props) => (
	<>
		<div className="flex flex-row items-center justify-between flex-wrap">
			<div className="cursor-pointer p-2 ">
				<Tooltip label="Upload An Image">
					<span onClick={() => setOpened(true)}>
						<IconPhoto
							size={25}
							className="hover:scale-125 duration-[110ms]"
						/>
					</span>
				</Tooltip>
			</div>
			<div className="cursor-pointer p-2 ">
				<Tooltip label="Post">
					<span onClick={handler}>
						<IconSend
							size={25}
							className="hover:scale-125 duration-[110ms]"
						/>
					</span>
				</Tooltip>
			</div>
		</div>
	</>
);
