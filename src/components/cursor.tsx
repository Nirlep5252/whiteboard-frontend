import { Tool } from "@/lib/states";
import { EraserIcon, MousePointer, PencilIcon } from "lucide-react";

export default function Cursor(props: {
  x: number;
  y: number;
  tool: Tool;
  username: string;
}) {
  const iconClassName = "w-4 h-4";
  const icon =
    props.tool === "pen" ? (
      <PencilIcon className={iconClassName} />
    ) : props.tool === "eraser" ? (
      <EraserIcon className={iconClassName} />
    ) : (
      <MousePointer className={iconClassName} />
    );

  return (
    <div
      className="absolute"
      style={{
        top: props.y,
        left: props.x,
      }}
    >
      <div className="icon">{icon}</div>
      <div className="username">{props.username}</div>
    </div>
  );
}
