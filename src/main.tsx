import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./pages/Home.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import Whiteboard from "./components/whiteboard.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/board/:boardId",
    element: <Whiteboard />,
  },
]);
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: Error) => {
      console.log(error);
      toast.error(error.message);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: Error) => {
      console.log(error);
      toast.error(error.message);
    },
  }),
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  </React.StrictMode>
);
