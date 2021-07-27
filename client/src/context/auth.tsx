import { createContext, useReducer, useContext, useEffect } from "react";
import { User } from "../types";
import Axios from "axios";

interface State {
  authenticated: boolean;
  user: User | undefined;
  loading: boolean;
  error?: string;
  toggleRender: boolean;
}

interface Action {
  type: string;
  payload: any;
}

const StateContext = createContext<State>({
  authenticated: false,
  user: null,
  loading: true,
  error: null,
  toggleRender: false,
});

const DispatchContext = createContext(null);

const reducer = (state: State, { type, payload }: Action) => {
  switch (type) {
    case "LOGIN":
      return {
        ...state,
        authenticated: true,
        user: payload,
        error: null,
      };
    case "LOGOUT":
      return { ...state, authenticated: false, user: null };
    case "STOP_LOADING":
      return { ...state, loading: false };
    case "ERROR":
      return { ...state, error: payload, authenticated: false };
    case "RERENDER":
      return { ...state, toggleRender: payload };
    default:
      throw new Error(`Unknown action type: ${type}`);
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, defaultDispatch] = useReducer(reducer, {
    user: null,
    authenticated: false,
    loading: true,
    error: false,
    toggleRender: false,
  });

  const dispatch = (type: string, payload?: any) =>
    defaultDispatch({ type, payload });

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await Axios.get("/auth/me");
        dispatch("LOGIN", res.data);
      } catch (err) {
        dispatch("ERROR", err);
      } finally {
        dispatch("STOP_LOADING");
      }
    }
    loadUser();

    return () => {
      async function loadUser() {
        try {
          const res = await Axios.get("/auth/me");
          dispatch("LOGIN", res.data);
        } catch (err) {
          dispatch("ERROR", err);
        } finally {
          dispatch("STOP_LOADING");
        }
      }
      loadUser();
    };
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
