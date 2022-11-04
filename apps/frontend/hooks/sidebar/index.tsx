import { useContext } from "react";
import { SidebarContext } from "../../context/sidebar";

export function useSidebar() {
  const data = useContext(SidebarContext);
  if (data === null)
    throw new Error("Component Tree not Wrapped in `SidebarProvider`");
  return data;
}
