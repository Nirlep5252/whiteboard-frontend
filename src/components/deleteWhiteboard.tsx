import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/lib/states";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import toast from "react-hot-toast";

export default function DeleteWhiteboard(props: { id: number }) {
  const queryClient = useQueryClient();
  const { keyCloak } = useAuth();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`/api/whiteboards/${id}/delete`, {
        mode: "cors",
        method: "POST",
        headers: {
          Authorization: `Bearer ${keyCloak.token}`,
        },
      });
    },
    mutationKey: ["deleteWhiteboard", props.id],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whiteboards"] });
      toast.success("Whiteboard deleted");
    },
  });

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger>
          <Trash2Icon className="w-5 h-5" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              whiteboard and remove all data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await mutateAsync(props.id);
              }}
            >
              {isPending ? "Working..." : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
