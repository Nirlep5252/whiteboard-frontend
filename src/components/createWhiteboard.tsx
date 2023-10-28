import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/states";
import toast from "react-hot-toast";

export default function CreateWhiteboard() {
  const queryClient = useQueryClient();
  const [whiteboardName, setWhiteboardName] = useState<string>("");
  const { keyCloak } = useAuth();
  const [open, setOpen] = useState<boolean>(false);

  const { mutateAsync: createWhiteboard, isPending } = useMutation({
    mutationKey: ["createWhiteboard", keyCloak.token],
    mutationFn: async (name: string) => {
      await fetch(`/api/whiteboards/${name}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${keyCloak.token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whiteboards"] });
      toast.success("Whiteboard created");
    },
  });

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Create Whiteboard</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Whiteboard</DialogTitle>
            <DialogDescription>
              Enter a name for your new whiteboard.
            </DialogDescription>
          </DialogHeader>

          <Input
            onChange={(e) => setWhiteboardName(e.target.value)}
            placeholder="Whiteboard name"
          />
          <DialogFooter>
            <Button onClick={() => setOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button
              disabled={isPending}
              onClick={async () => {
                if (whiteboardName === "") {
                  toast.error("Name cannot be empty");
                  return;
                }
                setWhiteboardName("");
                await createWhiteboard(whiteboardName);
                setOpen(false);
              }}
            >
              {isPending ? "Working..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
