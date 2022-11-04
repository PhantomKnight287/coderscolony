import { Avatar, useMantineTheme } from "@mantine/core";
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
        <Avatar src={props.avatarURL} />
        <div className="ml-2 flex-col flex">
          <span className={styles.name}>{props.name}</span>
          <span className="text-[12px] leading-[16px]">@{props.username}</span>
        </div>
      </div>
    </div>
  );
}

export default ForumMemberCard;
