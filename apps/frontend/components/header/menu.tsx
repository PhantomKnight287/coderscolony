import { useHydrateUserContext } from "@hooks/hydrate/context";
import { useUser } from "@hooks/user";
import { Menu, Button, Text, Avatar } from "@mantine/core";
import {
  IconSettings,
  IconSearch,
  IconPhoto,
  IconMessageCircle,
  IconTrash,
  IconArrowsLeftRight,
} from "@tabler/icons";

export function UserMenu() {
  const { profileImage, name } = useUser();
  useHydrateUserContext();
  return (
    <Menu shadow="md" width={200} closeOnClickOutside closeOnEscape>
      <Menu.Target>
        <div className="flex flex-row hover:bg-[#5c5f6659] duration-75 rounded-md p-2 items-center">
          <Avatar src={profileImage} radius="xl" size="md" />
          <span className="hidden sm:inline ml-2">{name}</span>
        </div>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>
        <Menu.Item icon={<IconSettings size={14} />}>Settings</Menu.Item>
        <Menu.Item icon={<IconMessageCircle size={14} />}>Messages</Menu.Item>
        <Menu.Item icon={<IconPhoto size={14} />}>Gallery</Menu.Item>
        <Menu.Item
          icon={<IconSearch size={14} />}
          rightSection={
            <Text size="xs" color="dimmed">
              ⌘K
            </Text>
          }
        >
          Search
        </Menu.Item>
        <Menu.Divider />
        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item icon={<IconArrowsLeftRight size={14} />}>
          Transfer my data
        </Menu.Item>

        <Menu.Item color="red" icon={<IconTrash size={14} />}>
          Delete my account
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
