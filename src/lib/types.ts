export type User = {
  email: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
};

export type Whiteboard = {
  id: number;
  name: string;
  owner: string;
  created_at: Date;
};
