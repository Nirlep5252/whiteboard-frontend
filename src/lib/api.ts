import { User, Whiteboard } from "./types";

export const getUser = async (token: string) => {
  return (await getData("user", token)) as User;
};

export const getWhiteboards = async (token: string) => {
  return (await getData("whiteboards", token)) as Whiteboard[];
};

export const getData = async (path: string, token: string) => {
  if (!token) return null;
  const res = await fetch(`/api/${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (res.status !== 200) throw new Error(data.message);
  return data;
};
