import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getFamily } from "~/data/data";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  console.log(params.lastname, "PARAMS SENT TO getFamily");
  return await getFamily(params.lastname);
};

const Family = () => {
  const family = useLoaderData<typeof loader>();
  console.log(family, "FAMILY");
  return (
    <div>
      <h2>Family info</h2>
      <h2>{family[0].family_last_name}</h2>
    </div>
  );
};

export default Family;
