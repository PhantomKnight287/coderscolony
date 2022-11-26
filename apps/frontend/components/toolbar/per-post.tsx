import { numberWithCommas } from "@helpers/number";
import { ActionIcon, Group, Text, useMantineTheme } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import {
  IconHeart,
  IconMessageCircle2,
  IconShare,
  IconCheck,
} from "@tabler/icons";

interface Props {
  showComment?: boolean;
  likes?: number;
  linkToCopy: string;
  likePost: () => void;
}

export function PostToolBar(props: Props) {
  const theme = useMantineTheme();
  const { copy, copied } = useClipboard();
  return (
    <Group position="apart" className="ml-10 mt-5">
      <Group spacing={"md"}>
        <div className="flex flex-row items-center justify-center">
          <ActionIcon onClick={props.likePost}>
            <IconHeart size={22} color={theme.colors.red[6]} stroke={1.5} />
          </ActionIcon>
          {props.likes!=undefined ? (
            <Text weight={"lighter"}>
              {numberWithCommas(props.likes)}
            </Text>
          ) : null}
        </div>
        {props.showComment ? (
          <ActionIcon>
            <IconMessageCircle2
              size={22}
              color={theme.colors.yellow[6]}
              stroke={1.5}
            />
          </ActionIcon>
        ) : null}
        <ActionIcon onClick={() => copy(props.linkToCopy)}>
          {copied ? (
            <IconCheck size={20} color={theme.colors.green[6]} stroke={1.5} />
          ) : (
            <IconShare size={20} color={theme.colors.blue[6]} stroke={1.5} />
          )}
        </ActionIcon>
      </Group>
    </Group>
  );
}
