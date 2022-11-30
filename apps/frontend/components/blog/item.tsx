import { Blog } from "db";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import {
  ActionIcon,
  Avatar,
  Badge,
  Card,
  CardProps,
  Center,
  createStyles,
  Group,
  Image,
  Skeleton,
  Text,
} from "@mantine/core";
import { imageResolver, profileImageResolver } from "@helpers/profile-url";
import { useState } from "react";
import styles from "./item.module.scss";
import { IconBookmark, IconHeart, IconShare } from "@tabler/icons";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "few s",
    m: "1 min",
    mm: "%d mins",
    h: "1 hr",
    hh: "%d hrs",
    d: "1 d",
    dd: "%d d",
    M: "a month",
    MM: "%d months",
    y: "a yr",
    yy: "%d yrs",
  },
});

const useStyles = createStyles((theme) => ({
  card: {
    position: "relative",
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    display: "flex",
    flexDirection: "column",
    transition: "all 150ms ease",
    ":hover": {
      scale: "1.1",
    },
  },

  rating: {
    position: "absolute",
    top: theme.spacing.xs,
    right: theme.spacing.xs + 2,
    pointerEvents: "none",
  },

  title: {
    display: "block",
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs / 2,
  },

  action: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[1],
    }),
  },

  footer: {
    marginTop: "auto",
  },
}));

export function BlogPost({
  createdAt,
  author,
  slug,
  ogImage,
  title,
  classname,
  description,
  ...others
}: Partial<Blog> & {
  author: { username: string; id: string; profileImage: string };
  classname?: string;
} & Partial<CardProps>) {
  const { classes, cx, theme } = useStyles();
  const linkProps = {
    href: `/u/${author.username}/blog/${slug}`,
  };

  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <Card
      withBorder
      radius="md"
      className={cx(classes.card, classname)}
      {...others}
    >
      <Card.Section>
        <Skeleton visible={!imageLoaded}>
          <a {...linkProps}>
            <Image
              src={imageResolver(ogImage!)}
              onLoad={() => setImageLoaded(true)}
              height={180}
            />
          </a>
        </Skeleton>
      </Card.Section>

      <Text className={classes.title} weight={500} component="a" {...linkProps}>
        {title}
      </Text>

      <Text size="sm" color="dimmed" lineClamp={4} mb="md">
        {description}
      </Text>

      <Group position="apart" className={classes.footer}>
        <Center>
          <Avatar
            src={profileImageResolver({
              profileURL: author.profileImage,
              username: author.username,
            })}
            size={24}
            radius="xl"
            mr="xs"
          />
          <Text size="sm" inline>
            {author.username}
          </Text>
        </Center>

        {/* <Group spacing={8} mr={0}>
          <ActionIcon className={classes.action}>
            <IconHeart size={16} color={theme.colors.red[6]} />
          </ActionIcon>
          <ActionIcon className={classes.action}>
            <IconBookmark size={16} color={theme.colors.yellow[7]} />
          </ActionIcon>
          <ActionIcon className={classes.action}>
            <IconShare size={16} />
          </ActionIcon>
        </Group> */}
      </Group>
    </Card>
  );
}
