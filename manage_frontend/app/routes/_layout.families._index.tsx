import { useLoaderData, Link } from "@remix-run/react";
import { getFamilies } from "~/data/data";
import { FamilyRecord } from "~/types/types";

export const loader = async () => {
  return await getFamilies();
};

const Families = () => {
  const families = useLoaderData<typeof loader>();
  return (
    <div>
      <Link to={"/families/add"}>
        <button className="btn-link">Add Family</button>
      </Link>
      <div className={"overflow-x-auto"}>
        <h1 className="text-xl">Families</h1>
        <table className="table table-xs">
          <thead>
            <tr>
              <th>ID</th>
              <th>Family Last Name</th>
              <th>Parent 1 First Name</th>
              <th>Parent 1 Last Name</th>
              <th>Parent 2 First Name</th>
              <th>Parent 2 Last Name</th>
            </tr>
          </thead>
          <tbody>
            {families.map((family: FamilyRecord) => {
              return (
                <tr key={family.id}>
                  <td>{family.id}</td>
                  <Link
                    to={`/families/${family.family_last_name.toLowerCase()}`}
                  >
                    <td>{family.family_last_name}</td>
                  </Link>
                  <td>{family.parent1_first_name}</td>
                  <td>{family.parent1_last_name}</td>
                  <td>{family.parent2_first_name}</td>
                  <td>{family.parent2_last_name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Families;
