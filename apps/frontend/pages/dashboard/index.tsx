import { useHydrateUserContext } from "@hooks/hydrate/context";
import { useSidebar } from "@hooks/sidebar";
import { Container } from "@mantine/core";
import { useEffect, useRef } from "react";

function Dashboard() {
  useHydrateUserContext();
  const ref = useRef<HTMLVideoElement>(null);
  const { opened, setOpened } = useSidebar();

  useEffect(() => {
    if (opened === false) return setOpened(true);
  }, [opened]);

  return (
    <>
      <Container>
        <video ref={ref} muted autoPlay />
      </Container>
    </>
  );
}

export default Dashboard;
