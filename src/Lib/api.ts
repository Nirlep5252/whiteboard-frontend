import { User } from "./types";

export const getUser = async (token: string) => {
  if (!token) return null;
  const res = await fetch("/api/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (res.status !== 200) throw new Error(data.message);
  return data as User;
};
