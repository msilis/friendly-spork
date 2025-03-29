import { createCookieSessionStorage } from "@remix-run/node";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [process.env.SESSION_SECRET || "secret-thing"],
    secure: process.env.NODE_ENV === "production",
  },
});

export type User = {
  name: string;
  token: string;
};

export const authenticateUser = async (username: string, password: string) => {
  return;
};
