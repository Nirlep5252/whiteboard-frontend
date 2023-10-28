import { useAuth } from "@/lib/states";
import { Button } from "./ui/button";

export default function LogOut() {
  const { keyCloak } = useAuth();

  return (
    <div className="absolute right-10 bottom-10">
      <Button
        onClick={() => {
          keyCloak.logout();
        }}
      >
        Log Out
      </Button>
    </div>
  );
}
