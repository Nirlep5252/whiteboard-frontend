import { useQuery } from "@tanstack/react-query";
import useAuth from "../Hooks/useAuth";
import { getUser } from "../Lib/api";

function Home() {
  const { isLoading, isAuthenticated, token } = useAuth();

  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["hello", token],
    queryFn: async () => getUser(token),
  });

  return (
    <div className="flex">
      <div>
        {isLoading || isUserLoading ? (
          <p>Loading...</p>
        ) : isAuthenticated ? (
          <p>Hello, {userData?.name}!</p>
        ) : (
          <p>Not logged in.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
