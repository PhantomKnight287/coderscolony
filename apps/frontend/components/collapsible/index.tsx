import { ReactNode, useState } from "react";
import {
  Group,
  Box,
  Collapse,
  ThemeIcon,
  Text,
  UnstyledButton,
  createStyles,
  TextStylesParams,
} from "@mantine/core";
import {
  TablerIcon,
  IconCalendarStats,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
  control: {
    fontWeight: 500,
    display: "block",
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fontSizes.sm,

    "&:hover": {
      backgroundColor: "transparent",
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
    minWidth: "189px",
  },

  link: {
    fontWeight: 500,
    display: "block",
    textDecoration: "none",
    marginLeft: 30,
    fontSize: theme.fontSizes.sm,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    borderLeft: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    cursor: "pointer",

    "&:hover": {
      backgroundColor: "transparent",
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },

  chevron: {
    transition: "transform 200ms ease",
    marginLeft: theme.spacing.sm,
  },
  text: {
    color: theme.colorScheme === "dark" ? "white" : "unset",
  },
}));

interface LinksGroupProps {
  icon: TablerIcon | null;
  label: string;
  initiallyOpened?: boolean;
  links?: {
    label: ReactNode;
    link?: string;
    handler?: () => void;
    id: string;
    style?: TextStylesParams;
  }[];
}

export function LinksGroup({
  icon: Icon,
  label,
  initiallyOpened,
  links,
}: LinksGroupProps) {
  const { classes, theme } = useStyles();
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const ChevronIcon = theme.dir === "ltr" ? IconChevronRight : IconChevronLeft;
  const { push } = useRouter();
  const items = (hasLinks ? links : []).map((link) => (
    <Text
      className={classes.link}
      key={link.id}
      onClick={() => {
        if (!link.handler && !link.link)
          throw new Error("Either a Handler or Link is required");
        if (link.link) return push(link.link);
        if (link.handler) link.handler();
      }}
      style={link.style}
    >
      {link.label}
    </Text>
  ));

  return (
    <>
      <UnstyledButton
        onClick={() => setOpened((o) => !o)}
        className={classes.control}
      >
        <Group position="apart" spacing={0}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {Icon && (
              <ThemeIcon variant="light" size={30}>
                <Icon size={18} />
              </ThemeIcon>
            )}
            <Box ml="md" className={classes.text}>
              {label}
            </Box>
          </Box>
          {hasLinks && (
            <ChevronIcon
              className={classes.chevron}
              size={14}
              stroke={1.5}
              style={{
                transform: opened
                  ? `rotate(${theme.dir === "rtl" ? -90 : 90}deg)`
                  : "none",
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}

export function NavbarLinksGroup(props: LinksGroupProps) {
  return (
    <Box
      sx={(theme) => ({
        padding: theme.spacing.md,
        minWidth: "190px",
      })}
    >
      <LinksGroup {...props} />
    </Box>
  );
}

const Collapsible = NavbarLinksGroup;

export { Collapsible };
