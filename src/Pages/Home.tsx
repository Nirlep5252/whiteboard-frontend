import { useQuery } from "@tanstack/react-query";
import useAuth from "../Hooks/useAuth";
import { getData } from "../Lib/api";
import { useEffect } from "react";

function Home() {
  const { isLoading, isAuthenticated, token } = useAuth();

  const helloQuery = useQuery({
    queryKey: ["hello", token],
    queryFn: async () => getData(token),
  });

  useEffect(() => {
    console.log(helloQuery.data);
  }, [helloQuery]);

  return (
    <div className="flex">
      <div>
        {isLoading
          ? "Loading..."
          : isAuthenticated
          ? "Logged in"
          : "Not logged in"}
      </div>
    </div>
  );
}

export default Home;
