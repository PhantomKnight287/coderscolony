import { useHydrateUserContext } from "@hooks/hydrate/context";
import { Container } from "@mantine/core";
import { useEffect, useRef } from "react";

function Dashboard() {
  useHydrateUserContext();
  const ref = useRef<HTMLVideoElement>(null);

  return (
    <>
      <Container>
        <video ref={ref} muted autoPlay />
      </Container>
    </>
  );
}

export default Dashboard;
