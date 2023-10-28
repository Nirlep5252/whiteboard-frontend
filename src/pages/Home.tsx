import { useQuery } from "@tanstack/react-query";
import { getUser, getWhiteboards } from "../lib/api";
import { useAuth } from "../lib/states";
import { Button } from "@/components/ui/button";
import CreateWhiteboard from "@/components/createWhiteboard";
import DeleteWhiteboard from "@/components/deleteWhiteboard";
import LogOut from "@/components/logOut";
import { Link } from "react-router-dom";

function Home() {
  const { keyCloak, loading } = useAuth();

  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["hello", keyCloak.token],
    queryFn: async () => getUser(keyCloak.token || ""),
  });
  const { data: whiteboardsData, isLoading: isWhiteboardsLoading } = useQuery({
    queryKey: ["whiteboards", keyCloak.token],
    queryFn: async () => getWhiteboards(keyCloak.token || ""),
  });

  return (
    <div className="flex flex-col gap-10 h-screen w-screen items-center justify-center relative">
      <LogOut />
      <div className="welcome">
        {loading || isUserLoading ? (
          <p>Loading...</p>
        ) : keyCloak.authenticated ? (
          <>
            <p className="text-3xl font-bold">Hello, {userData?.name}!</p>
          </>
        ) : (
          <p>
            Not logged in.{" "}
            <Button
              onClick={() => {
                keyCloak.login();
              }}
            >
              login
            </Button>
          </p>
        )}
      </div>
      <div className="boards">
        {loading || isWhiteboardsLoading ? (
          <p>Loading...</p>
        ) : keyCloak.authenticated ? (
          <div className="items-center justify-center">
            <p>Your whiteboards:</p>
            <ul className="flex flex-col gap-2 overflow-auto max-h-80 w-60">
              {whiteboardsData && whiteboardsData?.length > 0 ? (
                whiteboardsData?.map((whiteboard) => (
                  <li
                    className="border border-border p-2 rounded-lg flex items-center justify-between"
                    key={whiteboard.id}
                  >
                    <Link to={`/board/${whiteboard.id}`}>
                      {whiteboard.name}
                    </Link>
                    <DeleteWhiteboard id={whiteboard.id} />
                  </li>
                ))
              ) : (
                <div className="text-xl py-2">No whiteboards.</div>
              )}
            </ul>
            <div className="mt-2">
              <CreateWhiteboard />
            </div>
          </div>
        ) : (
          <p>Not logged in.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
