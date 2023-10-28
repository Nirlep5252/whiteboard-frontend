import { useWhiteboardOptions } from "@/lib/states";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { Settings2Icon } from "lucide-react";
import { Slider } from "./ui/slider";

export default function WhiteboardSettings() {
  const { color, setColor, width, setWidth } = useWhiteboardOptions();

  return (
    <>
      <Popover>
        <PopoverTrigger className="z-50" asChild>
          <Button className="z-50" variant={"ghost"}>
            <Settings2Icon />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col gap-2">
            <div className="label text-sm font-semibold">
              Stroke Width: {width}
            </div>
            <Slider
              onValueChange={(value) => setWidth(value[0])}
              defaultValue={[width]}
              max={100}
              min={1}
              step={1}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="label text-sm font-semibold">
              Stroke Color: {color}
            </div>
            <input
              type="color"
              defaultValue={color}
              onChange={(e) => {
                setColor(e.target.value);
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
