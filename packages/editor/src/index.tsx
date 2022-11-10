import { Toolbar } from "components/toolbar";
import { FC } from "react";
import styles from "./styles.module.css";

interface Props {}

const Editor: FC<{}> = () => {
  return (
    <>
      <div className={styles.container}>
        <Toolbar />
      </div>
    </>
  );
};
export { Editor };
export default Editor;
