import ForumMemberCard from "@components/cards/forum-members";
import { Collapsible } from "@components/collapsible";
import { FC } from "react";

interface Props {
  moderators: {
    role: "MODERATOR";
    user: {
      username: string;
      profileImage: string;
      name: string;
    };
  }[];
  admins: {
    role: "ADMIN";
    user: {
      username: string;
      profileImage: string;
      name: string;
    };
  }[];
}

export const ForumSidebar: FC<Props> = ({ admins, moderators }) => {
  return (
    <>
      {admins.length > 0 ? (
        <Collapsible
          icon={null}
          label="Admins"
          initiallyOpened
          links={admins.map((d) => ({
            id: d.user.username,
            label: (
              <ForumMemberCard
                avatarURL={d.user.profileImage}
                name={d.user.name}
                username={d.user.username}
              />
            ),
            handler() {},
          }))}
        />
      ) : null}
      {moderators.length > 0 ? (
        <Collapsible
          icon={null}
          label="Moderators"
          initiallyOpened
          links={moderators.map((d) => ({
            id: d.user.username,
            label: (
              <ForumMemberCard
                avatarURL={d.user.profileImage}
                name={d.user.name}
                username={d.user.username}
              />
            ),
            handler() {},
          }))}
        />
      ) : null}
    </>
  );
};
