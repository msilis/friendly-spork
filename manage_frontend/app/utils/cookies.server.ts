import { createCookie } from "@remix-run/node";

export const themePrefs = createCookie("theme_prefs", {
  maxAge: 604_800,
  sameSite: "lax",
});

export const getTheme = async (request) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookieValue = await themePrefs.parse(cookieHeader);
  return cookieValue === "dark" ? "dark" : "light";
};

export const setTheme = async (theme, headers) => {
  return {
    headers: {
      "Set-Cookie": await themePrefs.serialize(theme),
      ...headers,
    },
  };
};
