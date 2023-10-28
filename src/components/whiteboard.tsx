import { Tool, useAuth, useWhiteboardOptions } from "@/lib/states";
import { useParams } from "react-router-dom";
import { Stage, Line, Layer } from "react-konva";
import { Fragment, useEffect, useRef, useState } from "react";
import ToolSelector from "./toolSelector";
import WhiteboardSettings from "./whiteboardSettings";
import toast from "react-hot-toast";
import Cursor from "./cursor";
import useWebSocket from "react-use-websocket";
import { Button } from "./ui/button";
import { Redo2, Undo2 } from "lucide-react";
import * as htmlToImage from "html-to-image";

type T_Line = {
  tool: Tool;
  points: number[];
  color: string;
  width: number;
  x: number;
  y: number;
};
let linesHistory: T_Line[][] = [[]];
let index = 0;

// function from https://stackoverflow.com/a/15832662/512042
function downloadURI(uri: string, name: string) {
  const link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function Whiteboard() {
  const { boardId } = useParams();
  const { keyCloak, loading } = useAuth();

  const { tool, color, width } = useWhiteboardOptions();
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [lines, setLines] = useState<T_Line[]>([]);

  const [users, setUsers] = useState<
    {
      username: string;
      x: number;
      y: number;
      tool: Tool;
    }[]
  >([]);
  const [connected, setConnected] = useState<boolean>(false);

  const handleRedo = () => {
    if (index === linesHistory.length - 1) return;
    index += 1;
    setLines(linesHistory[index]);
    sendJsonMessage({
      type: "lines",
      lines: linesHistory[index],
    });
  };

  const handleUndo = () => {
    if (index === 0) return;
    index -= 1;
    setLines(linesHistory[index]);
    sendJsonMessage({
      type: "lines",
      lines: linesHistory[index],
    });
  };

  const { sendJsonMessage } = useWebSocket(
    `ws://localhost:8000/whiteboard/${boardId}`,
    {
      reconnectInterval: 1000,
      onOpen: () => {
        sendJsonMessage({
          type: "auth",
          token: keyCloak?.token,
        });
      },
      shouldReconnect: () => true,
      onMessage: (e) => {
        const data = JSON.parse(e.data);
        if (data.type === "join") {
          if (data.user === keyCloak.tokenParsed?.preferred_username) {
            toast.success("Joined whiteboard");
            setConnected(true);
            window.addEventListener("mousemove", (e) => {
              sendJsonMessage({
                type: "mouse",
                x: e.clientX,
                y: e.clientY,
              });
            });
          } else {
            if (users.find((user) => user.username === data.user)) return;
            toast(`${data.user} joined the whiteboard`);
            setUsers([
              ...users,
              {
                username: data.user,
                x: 0,
                y: 0,
                tool: "pen",
              },
            ]);
          }
        }

        if (
          data.type === "lines" &&
          data.user !== keyCloak.tokenParsed?.preferred_username
        ) {
          linesHistory = linesHistory.slice(0, index + 1);
          linesHistory = linesHistory.concat([data.lines]);
          index += 1;
          setLines(data.lines);
        }

        if (data.type === "tool") {
          console.log(data);
          console.log(users);
          const user = users.find((user) => user.username === data.user);
          if (user) {
            user.tool = data.tool;
            setUsers(users.concat());
          }
        }

        if (data.type === "leave") {
          toast(`${data.user} left the whiteboard`);
          setUsers(users.filter((user) => user.username !== data.user));
        }

        if (data.type === "error") {
          // toast.error(data.message);
          console.log(data.message);
        }

        if (
          data.type === "mouse" &&
          data.user !== keyCloak.tokenParsed?.preferred_username
        ) {
          const user = users.find((user) => user.username === data.user);
          if (user) {
            user.x = data.x;
            user.y = data.y;
            setUsers(users.concat());
          } else {
            setUsers([
              ...users,
              {
                username: data.user,
                x: data.x,
                y: data.y,
                tool: "pen",
              },
            ]);
          }
        }
      },
    }
  );

  useEffect(() => {
    sendJsonMessage({
      type: "tool",
      tool,
    });
  }, [tool, sendJsonMessage]);

  const stageRef = useRef<HTMLDivElement>(null);
  const takeScreenShot = async (node: HTMLDivElement | null) => {
    if (!node) return;
    const dataURI = await htmlToImage.toJpeg(node, {
      backgroundColor: "#ffffff",
    });
    return dataURI;
  };

  const download = (
    image: string | undefined,
    { name = "img", extension = "jpg" } = {}
  ) => {
    const a = document.createElement("a");
    a.href = image!;
    a.download = `${name}.${extension}`;
    a.click();
  };

  const downloadScreenshot = () =>
    takeScreenShot(stageRef.current).then(download);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center text-3xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative">
      {users.map((user, i) => {
        return (
          <Cursor
            key={i}
            tool={user.tool}
            username={user.username}
            x={user.x}
            y={user.y}
          />
        );
      })}
      <div className="absolute left-5 top-5">
        <ToolSelector />
      </div>
      <div className="absolute right-5 top-5 z-50 flex gap-5 items-center justify-center">
        <div>Status: {connected ? "Connected" : "Connecting..."}</div>
        <WhiteboardSettings />
      </div>
      <div className="absolute left-5 bottom-5 z-50">
        <div className="flex flex-col gap-2 z-50">
          <div className="undo">
            <Button onClick={handleUndo} className="z-50" variant={"ghost"}>
              <Undo2 />
            </Button>
          </div>
          <div className="redo">
            <Button variant={"ghost"} className="z-50" onClick={handleRedo}>
              <Redo2 />
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute right-5 bottom-5 z-10">
        <Button onClick={downloadScreenshot}>Download</Button>
      </div>
      <div ref={stageRef}>
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseDown={(e) => {
            setIsDrawing(true);
            const pos = e.target.getStage()?.getPointerPosition();
            if (pos && tool !== "select") {
              setLines([
                ...lines,
                {
                  tool,
                  points: [pos.x, pos.y],
                  color,
                  width,
                  x: 0,
                  y: 0,
                },
              ]);
            }
          }}
          onMouseUp={() => {
            setIsDrawing(false);
            linesHistory = linesHistory.slice(0, index + 1);
            linesHistory = linesHistory.concat([lines]);
            index += 1;
            setLines(lines);
            sendJsonMessage({
              type: "lines",
              lines,
            });
          }}
          onMouseMove={(e) => {
            if (!isDrawing || tool === "select") return;
            const stage = e.target.getStage();
            const point = stage?.getPointerPosition();
            if (point) {
              const lastLine = lines[lines.length - 1];
              lastLine.points = lastLine.points.concat([point?.x, point?.y]);
              lines.splice(lines.length - 1, 1, lastLine);
              setLines(lines.concat());
              // sendJsonMessage({
              //   type: "lines",
              //   lines,
              // });
            }
          }}
        >
          <Layer>
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.color}
                strokeWidth={line.width}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                draggable={tool === "select"}
                x={line.x}
                y={line.y}
                onDragMove={(e) => {
                  lines[i].x = e.target.x();
                  lines[i].y = e.target.y();
                  setLines(lines);
                  sendJsonMessage({
                    type: "lines",
                    lines,
                  });
                }}
                onDragEnd={() => {
                  linesHistory = linesHistory.slice(0, index + 1);
                  linesHistory = linesHistory.concat([lines]);
                  index += 1;
                  setLines(lines);
                  sendJsonMessage({
                    type: "lines",
                    lines,
                  });
                }}
                globalCompositeOperation={
                  line.tool === "eraser" ? "destination-out" : "source-over"
                }
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
