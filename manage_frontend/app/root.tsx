import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";
import { ClassProvider } from "./contexts/classContext";
import { AlertProvider } from "./contexts/alertContext";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme data-testid="main-page">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `
                        (function() {
                          const theme = sessionStorage.getItem('colour-theme');
                          if (theme === 'dark') {
                            document.documentElement.setAttribute('data-theme', theme);
                            document.body.setAttribute('data-theme', theme);
                          }
                        })();
                      `,
          }}
        />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <AlertProvider>
      <ClassProvider>
        <Outlet />
      </ClassProvider>
    </AlertProvider>
  );
}
