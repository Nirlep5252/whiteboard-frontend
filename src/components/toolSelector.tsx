import { useWhiteboardOptions } from "@/lib/states";
import { EraserIcon, MousePointer, PencilIcon } from "lucide-react";
import { Button } from "./ui/button";

export default function ToolSelector() {
  const { tool, setTool } = useWhiteboardOptions();

  return (
    <div className="z-50">
      <div className="flex items-center justify-center gap-4 [&>*]:px-4 [&>*]:z-50 [&>*]:cursor-pointer">
        <Button variant="ghost" onClick={() => setTool("pen")}>
          <PencilIcon />
        </Button>
        <Button variant={"ghost"} onClick={() => setTool("eraser")}>
          <EraserIcon />
        </Button>
        <Button variant={"ghost"} onClick={() => setTool("select")}>
          <MousePointer />
        </Button>
        <div className="current-tool">Current tool: {tool}</div>
      </div>
    </div>
  );
}
