export const getData = async (token: string) => {
  if (!token)
    return {
      error: true,
      message: "Unauthorized",
    };
  const res = await fetch("/api", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  return data;
};
