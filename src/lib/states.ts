import { create } from "zustand";
import Keycloak from "keycloak-js";

type authState = {
  keyCloak: Keycloak;
  error: string;
  loading: boolean;
};

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
