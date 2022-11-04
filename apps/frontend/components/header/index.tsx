import styles from "./header.module.scss";
import {
  Burger,
  Button,
  Header as MantineHeader,
  useMantineColorScheme,
} from "@mantine/core";
import { clsx } from "clsx";
import Link from "next/link";
import { useUser } from "@hooks/user";
import { UserMenu } from "./menu";
import { useDrawer } from "@hooks/drawer";

export function Header() {
  const { colorScheme } = useMantineColorScheme();
  const { id } = useUser();
  const { opened, setOpened } = useDrawer();

  return (
    <MantineHeader height={60} className={styles.container_}>
      <div className="lg:hidden">
        <Burger opened={opened} onClick={() => setOpened((o) => !o)} />
      </div>
      <div className={styles.avatar}>
        <Link href={"/"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-briefcase"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke={colorScheme === "dark" ? "#1a1b1e" : "currentcolor"}
            fill="white"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <rect x="3" y="7" width="18" height="13" rx="2"></rect>
            <path d="M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="12" y1="12" x2="12" y2="12.01" strokeWidth={2}></line>
            <path d="M3 13a20 20 0 0 0 18 0"></path>
          </svg>
        </Link>
      </div>
      {Boolean(id) === true ? (
        <UserMenu />
      ) : (
        <div className={styles["authButtonContainer"]}>
          <Button
            variant="default"
            className={clsx(
              "hover:scale-110 duration-[110ms] active:translate-y-[2px]",
              {
                "text-black": colorScheme === "light",
              }
            )}
            radius="lg"
            component={Link}
            href="/auth/signup"
          >
            Join
          </Button>
          <Button
            variant="default"
            radius="lg"
            className={clsx(
              "hover:scale-110 duration-[110ms] active:translate-y-[2px]",
              {
                "text-black": colorScheme === "light",
              }
            )}
            component={Link}
            href="/auth/login"
          >
            Login
          </Button>
        </div>
      )}
    </MantineHeader>
  );
}
