import { useHydrateUserContext } from "@hooks/hydrate/context";

function Dashboard() {
  useHydrateUserContext();
  return <div>Dashboard</div>;
}

export default Dashboard;
