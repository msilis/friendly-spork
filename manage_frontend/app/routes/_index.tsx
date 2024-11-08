import type { MetaFunction } from "@remix-run/node";
import Navigation from "~/components/Navigation";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div>
      <div>Index Route</div>
    </div>
  );
}
