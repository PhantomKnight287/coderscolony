import { Sidebar } from "@components/navigation/sidebar";
import { useSidebar } from "@hooks/sidebar";
import { useRouter } from "next/router";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import styles from "./layout.module.scss";

const Layout: FC<PropsWithChildren<{}>> = ({ children }) => {
  // const { id } = useUser();
  const { opened } = useSidebar();
  // if (!id) return <>{children}</>;
  const { asPath } = useRouter();
  const [addClass, setAddClass] = useState(true);

  useEffect(() => {
    if (/\/u\/.*/.test(asPath)) {
      setAddClass(false);
    } else {
      setAddClass(true);
    }
  }, [asPath]);

  return (
    <>
      <div className={addClass ? styles.container : ""}>
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
