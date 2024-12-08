import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getFamily } from "~/data/data";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  return await getFamily(params.lastname);
};

const Family = () => {
  const familyData = useLoaderData<typeof loader>();
  const family = familyData[0];

  return (
    <>
      <Link to={"/families"}>
        <button className="btn-link">Back</button>
      </Link>
      <section className="ml-12 flex ">
        <div>
          <h1 className="font-semibold text-lg pb-4 pt-4">Family info</h1>
          <h2 className="font-light mb-2">Family Last Name</h2>
          <p className="pb-4">{family.family_last_name}</p>
          <h2 className="font-light mb-2">Parent 1 First Name</h2>
          <p className="pb-4">{family.parent1_first_name}</p>

          <h2 className="font-light mb-2">Parent 1 Last Name</h2>
          <p className="pb-4">{family.parent1_last_name}</p>

          <h2 className="font-light mb-2">Parent 1 Email</h2>
          <p className="pb-4">{family.parent1_email}</p>

          <h2 className="font-light mb-2">Parent 1 Mobile Phone</h2>
          <p className="pb-4">{family.parent1_mobile_phone}</p>

          <h2 className="font-light mb-2">Parent 1 Address</h2>
          <p className="pb-4">
            {family.parent1_address ? family.parent1_address : "None on file"}
          </p>
        </div>
        <div className="ml-8 mt-14">
          {family.parent2_first_name ? (
            <>
              <h2 className="font-light mb-2">Parent 2 First Name</h2>
              <p className="pb-4">{family.parent2_first_name}</p>

              <h2 className="font-light mb-2">Parent 2 Last Name</h2>
              <p className="pb-4">{family.parent2_last_name}</p>

              <h2 className="font-light mb-2">Parent 2 Email</h2>
              <p className="pb-4">{family.parent2_email}</p>

              <h2 className="font-light mb-2">Parent 2 Mobile Phone</h2>
              <p className="pb-4">{family.parent2_mobile_phone}</p>

              <h2 className="font-light mb-2">Parent 2 Address</h2>
              <p className="pb-4">{family.parent2_address}</p>
            </>
          ) : null}
        </div>
      </section>
    </>
  );
};

export default Family;
