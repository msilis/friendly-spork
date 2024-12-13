import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "Manage" }, { name: "description", content: "Manage" }];
};

export default function Index() {
  return (
    <div>
      <div>Index Route</div>
    </div>
  );
}
