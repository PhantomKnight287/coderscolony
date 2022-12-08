import { useContext } from "react";
import { UserContext } from "../../context/user";

export function useUser() {
	const context = useContext(UserContext);
	if (context === null) throw new Error("App not wrapped in `UserProvider`");
	return context.user;
}

export function useUserDispatch() {
	const context = useContext(UserContext);
	if (context === null) throw new Error("App not wrapped in `UserProvider`");
	return context.setUser;
}
