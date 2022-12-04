import {
  Card,
  Text,
  Group,
  Button,
  createStyles,
  Avatar,
} from "@mantine/core";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },

  section: {
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },

  like: {
    color: theme.colors.red[6],
  },

  label: {
    textTransform: "uppercase",
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
    maxHeight: "20px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    maxWidth: "333.5px",
    textOverflow: "ellipsis",
  },
  likeFilled: {
    fill: theme.colors.red[6],
    stroke:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : "currentcolor",
    strokeWidth: 1,
  },
}));

interface BadgeCardProps {
  createdAt: Date;
  id: string;
  name: string;
  profileImage: string | null;
  bannerImage: string | null;
  forumMembers: number;
  urlSlug: string;
  description: string;
}

export function ForumCard({
  bannerImage,
  createdAt,
  forumMembers,
  id,
  name,
  profileImage,
  urlSlug,
  description,
}: BadgeCardProps) {
  const { classes, theme } = useStyles();
  const { push } = useRouter();
  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Card.Section>
        <Avatar
          src={
            profileImage
              ? `/images/${profileImage}`
              : `https://avatars.dicebear.com/api/bottts/${encodeURIComponent(
                  name
                )}.svg`
          }
          alt={name}
          radius="xl"
          size="xl"
          ml="xl"
          mt="md"
        />
      </Card.Section>

      <Card.Section className={classes.section} mt="md">
        <Group position="apart">
          <Text size="lg" weight={500}>
            {name}
          </Text>
        </Group>
      </Card.Section>
      <Group mt="xs">
        <Button
          radius="md"
          style={{ flex: 1 }}
          onClick={() => push(`/f/${urlSlug}`)}
          className={
            "hover:bg-[#1864ab] active:bg-[#1864ab] bg-[#4dabf7] mt-auto"
          }
        >
          Show details
        </Button>
        {/* <ActionIcon variant="default" radius="md" size={36}>
          <IconHeart size={18} className={classes.likeFilled} stroke={1.5} />
        </ActionIcon> */}
      </Group>
    </Card>
  );
}
