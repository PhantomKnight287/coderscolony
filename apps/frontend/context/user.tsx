import { User } from "db";
import { createContext, ReactNode, useReducer } from "react";

enum Events {
  SetUser,
  Logout,
}

type User_ = Exclude<User, "password">;

type Context = {
  user: User_;
  setUser: (payload: {
    type: keyof typeof Events;
    payload: Partial<User_> | null;
  }) => void;
};

export const UserContext = createContext<Context | null>(null);

const reducer = (
  state: Partial<User_>,
  action: {
    type: keyof typeof Events;
    payload: Partial<User_> | null;
  }
): Partial<User> => {
  switch (action.type) {
    case "Logout": {
      return {};
    }
    case "SetUser": {
      return {
        ...state,
        ...action.payload,
      };
    }
  }
};

export function UserProvider({
  children,
}: {
  children: ReactNode[] | ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, {});
  return (
    <UserContext.Provider
      value={{
        user: state as unknown as User,
        setUser: dispatch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
