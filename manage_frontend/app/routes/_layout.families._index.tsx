import { useLoaderData, Link, useRevalidator } from "@remix-run/react";
import { deleteFamily, getFamilies } from "~/data/data";
import { FamilyRecord } from "~/types/types";
import { useRef, useState } from "react";
import { useToast } from "~/hooks/hooks";

export const loader = async () => {
  return await getFamilies();
};

const Families = () => {
  const families = useLoaderData<typeof loader>();
  const confirmationRef = useRef<HTMLDialogElement>(null);
  const toast = useToast();
  const revalidate = useRevalidator();
  let familyIdToDelete: number | undefined;
  const [familyOrder, setFamilyOrder] = useState<FamilyRecord[]>(families);
  const handleDeleteClick = (id: number | undefined) => {
    confirmationRef.current?.showModal();
    familyIdToDelete = id;
  };

  const handleDeleteConfirmation = () => {
    deleteFamily(familyIdToDelete);
    revalidate.revalidate();
    familyIdToDelete = undefined;
    confirmationRef.current?.close();
    toast.success("Family deleted successfully");
  };
  const handleFamilyReorder = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const currentValue = event.target?.value;
    switch (currentValue) {
      case "lastNameDescending": {
        const sortedNames = [...families].sort(
          (a: FamilyRecord, b: FamilyRecord) => {
            return b.family_last_name.localeCompare(a.family_last_name);
          }
        );
        setFamilyOrder(sortedNames);
        break;
      }
      case "lastNameAscending": {
        const sortedNames = [...families].sort(
          (a: FamilyRecord, b: FamilyRecord) => {
            return a.family_last_name.localeCompare(b.family_last_name);
          }
        );
        setFamilyOrder(sortedNames);
        break;
      }
      default:
        setFamilyOrder(families);
    }
  };

  return (
    <div className={"overflow-x-auto"}>
      <h1 className="text-xl font-bold mb-4">Families</h1>
      <Link to={"/families/add"}>
        <button className="btn btn-outline btn-primary btn-sm mb-4">
          Add Family
        </button>
      </Link>
      <div className="mt-2 mb-2">
        <label htmlFor="student-order-select">Order:</label>
        <select
          className="select select-sm ml-2"
          defaultValue="default"
          onChange={(event) => handleFamilyReorder(event)}
        >
          <option value="default">Default</option>
          <option value="lastNameDescending">Last Name &#x2193;</option>
          <option value="lastNameAscending">Last Name &#x2191;</option>
        </select>
      </div>
      <table className="table table-xs">
        <thead>
          <tr>
            <th>ID</th>
            <th>Family Last Name</th>
            <th>Parent 1 First Name</th>
            <th>Parent 1 Last Name</th>
            <th>Parent 2 First Name</th>
            <th>Parent 2 Last Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {familyOrder?.map((family: FamilyRecord) => {
            return (
              <tr key={family?.id}>
                <td>{family?.id}</td>

                <td>
                  <Link
                    to={`/families/${family?.family_last_name?.toLowerCase()}`}
                    className="hover:underline hover:text-blue-500"
                    title="Click to see family info"
                  >
                    {family?.family_last_name}
                  </Link>
                </td>

                <td>{family?.parent1_first_name}</td>
                <td>{family?.parent1_last_name}</td>
                <td>{family?.parent2_first_name}</td>
                <td>{family?.parent2_last_name}</td>
                <td>
                  <button
                    onClick={() => handleDeleteClick(family.id)}
                    title="Delete"
                  >
                    <img
                      src="icons8-delete.svg"
                      alt="delete student"
                      className="hover:cursor-pointer"
                    />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <dialog ref={confirmationRef} className="modal">
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => confirmationRef.current?.close()}
          >
            ✕
          </button>
          <p>Are you sure you want to delete this teacher?</p>
          <div className="flex gap-4 mt-4">
            <button
              className="btn btn-secondary"
              onClick={() => confirmationRef.current?.close()}
            >
              Cancel
            </button>
            <button
              className="btn btn-accent"
              onClick={handleDeleteConfirmation}
            >
              Yes
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Families;
