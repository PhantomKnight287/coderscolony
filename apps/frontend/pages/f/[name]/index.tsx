import { useHydrateUserContext } from "@hooks/hydrate/context";
import { useRouter } from "next/router";

export default function Forum() {
  useHydrateUserContext();
  const { query } = useRouter();
  return <>{JSON.stringify(query)}</>;
}
