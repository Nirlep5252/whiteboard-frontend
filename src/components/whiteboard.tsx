import { useParams } from "react-router-dom";

export default function Whiteboard() {
  const { boardId } = useParams();

  return (
    <>
      <div>{boardId}</div>
    </>
  );
}
