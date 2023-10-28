import { create } from "zustand";
import Keycloak from "keycloak-js";

interface authState {
  keyCloak: Keycloak;
  error: string;
  loading: boolean;
}

export const useAuth = create<authState>((set) => {
  const client = new Keycloak({
    url: import.meta.env.VITE_KEYCLOAK_URL,
    realm: import.meta.env.VITE_KEYCLOAK_REALM,
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT,
  });
  client
    .init({
      onLoad: "login-required",
    })
    .then(() => {
      set({
        keyCloak: client,
        error: "",
        loading: false,
      });
    });
  return {
    keyCloak: client,
    error: "",
    loading: true,
  };
});

export type Tool = "pen" | "eraser" | "select";
interface whiteboardOptionsState {
  tool: Tool;
  width: number;
  color: string;

  setTool: (tool: Tool) => void;
  setWidth: (width: number) => void;
  setColor: (color: string) => void;
}

export const useWhiteboardOptions = create<whiteboardOptionsState>((set) => {
  return {
    tool: "pen",
    setTool: (tool: Tool) => set({ tool }),

    width: 5,
    setWidth: (width: number) => set({ width }),

    color: "#000000",
    setColor: (color: string) => set({ color }),
  };
});
