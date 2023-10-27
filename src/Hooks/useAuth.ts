import { useEffect, useRef, useState } from "react";
import Keycloak from "keycloak-js";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");

  const isRun = useRef(false);
  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true;

    const client = new Keycloak({
      url: import.meta.env.VITE_KEYCLOAK_URL,
      realm: import.meta.env.VITE_KEYCLOAK_REALM,
      clientId: import.meta.env.VITE_KEYCLOAK_CLIENT,
    });
    client
      .init({ onLoad: "login-required" })
      .then((res) => {
        setIsAuthenticated(res);
        setToken(client.token || "");
      })
      .catch((err) => {
        console.error(err);
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { isAuthenticated, isLoading, isError, token };
};

export default useAuth;
