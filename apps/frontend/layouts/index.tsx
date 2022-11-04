import { Sidebar } from "@components/navigation/sidebar";
import { useSidebar } from "@hooks/sidebar";
import { useUser } from "@hooks/user";
import clsx from "clsx";
import { FC, PropsWithChildren } from "react";
import styles from "./layout.module.scss";

const Layout: FC<PropsWithChildren<{}>> = ({ children }) => {
  const { id } = useUser();
  const { opened } = useSidebar();
  if (!id) return <>{children}</>;
  return (
    <>
      <div className={styles.container}>
        {opened ? (
          <div className={styles.sidebar}>
            <Sidebar />
          </div>
        ) : null}
        <div className={styles.content}>{children}</div>
      </div>
    </>
  );
};

export default Layout;
