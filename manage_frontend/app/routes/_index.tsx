import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "Manage" }, { name: "description", content: "Manage" }];
};

export default function Index() {
  return (
    <div className="flex content-center p-4 bg-black h-dvh flex-col ">
      <h1 className="mt-4 font-bold text-4xl text-white ml-auto mr-auto w-fit">
        /Manage
      </h1>
      <img
        src="LauderdaleSketch.webp"
        alt="Sketch of Lauderdale House"
        className="h-64 w-96 ml-auto mr-auto pt-8"
      />
      <a
        className="btn btn-soft btn-succes w-fit ml-auto mr-auto mt-8"
        href="/login"
      >
        Get going
      </a>
    </div>
  );
}
