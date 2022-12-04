import { profileImageResolver } from "@helpers/profile-url";
import { Avatar, useMantineTheme } from "@mantine/core";
import Link from "next/link";
import styles from "./forums-member.module.scss";

interface Props {
	avatarURL: string;
	name: string;
	username: string;
}

function ForumMemberCard(props: Props) {
	const { colorScheme } = useMantineTheme();
	return (
		<div className="pl-2">
			<div
				className={`hover:scale-110 duration-[110ms] flex flex-row items-center ${styles[colorScheme]} rounded-md p-2 ml-1`}
			>
				<Avatar
					src={profileImageResolver({
						profileURL: props.avatarURL,
						username: props.username,
					})}
					radius="lg"
				/>
				<div className="ml-2 flex-col flex">
					<Link href={`/u/${props.username}`}>
						<span className={styles.name}>{props.name}</span>
					</Link>
					<Link href={`/u/${props.username}`}>
						<span className="text-[12px] leading-[16px] hover:underline">
							@{props.username}
						</span>
					</Link>
				</div>
			</div>
		</div>
	);
}

export default ForumMemberCard;
