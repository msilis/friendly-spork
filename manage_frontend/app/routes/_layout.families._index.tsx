import {
  useLoaderData,
  Link,
  useRevalidator,
  useFetcher,
} from "@remix-run/react";
import { deleteFamily, getFamilies } from "~/data/data.server";
import { FamilyRecord } from "~/types/types";
import { useEffect, useRef, useState } from "react";
import { useToast } from "~/hooks/hooks";
import { ActionFunction, ActionFunctionArgs } from "@remix-run/node";

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "delete") {
    const familyId = formData.get("family_id");
    if (typeof familyId === "string" && familyId) {
      try {
        const result = await deleteFamily(parseInt(familyId, 10));
        console.log(result, "result");
        if (result?.success) {
          return Response.json({ success: true, message: "Family deleted." });
        } else {
          return Response.json({
            success: false,
            message: "There was an error deleting the family.",
          });
        }
      } catch (error) {
        console.error("There was an error deleting the family: ", error);
        return Response.json({
          success: false,
          message: "Server error deleting family.",
        });
      }
    } else {
      return Response.json({ message: "Invalid family ID" });
    }
  } else {
    return Response.json({ success: false, message: "Invalid form intent" });
  }
};

export const loader = async () => {
  try {
    const families = await getFamilies();
    return Response.json({ families });
  } catch (error) {
    console.error(
      "There was an error getting the list of families from the database: ",
      error
    );
    return Response.json(
      {
        message:
          "Sorry, there was an error getting the list of families from the database. Please try again later.",
      },
      { status: 500 }
    );
  }
};

const Families = () => {
  const loaderData = useLoaderData<{
    message?: string;
    families?: FamilyRecord[];
  }>();
  const families = loaderData.families;
  const errorMessage = loaderData.message;
  const confirmationRef = useRef<HTMLDialogElement>(null);
  const toast = useToast();
  const revalidate = useRevalidator();
  const fetcher = useFetcher();
  let familyIdToDelete: number | undefined;
  const [familyOrder, setFamilyOrder] = useState<FamilyRecord[] | undefined>(
    families
  );
  const handleDeleteClick = (id: number | undefined) => {
    confirmationRef.current?.showModal();
    familyIdToDelete = id;
  };

  useEffect(() => {
    if (loaderData.families) {
      setFamilyOrder(loaderData.families);
    }
  }, [loaderData.families]);

  const handleDeleteConfirmation = async () => {
    if (familyIdToDelete !== undefined) {
      fetcher.submit(
        {
          intent: "delete",
          family_id: familyIdToDelete.toString(),
        },
        { method: "POST" }
      );
      familyIdToDelete = undefined;
      confirmationRef.current?.close();
      revalidate.revalidate();
      toast.success("Family deleted successfully");
    }
  };
  const handleFamilyReorder = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (!families?.length) return;
    const currentValue = event.target?.value;
    switch (currentValue) {
      case "lastNameDescending": {
        const sortedNames: FamilyRecord[] | undefined = [...families]?.sort(
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

  if (loaderData?.message) {
    return (
      <div className="alert alert-error w-5/6 mt-8">
        <svg
          fill="none"
          viewBox="0 0 24 24"
          className="w-6 h-6 stroke-current mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          ></path>
        </svg>
        <span>{errorMessage}</span>
      </div>
    );
  }

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
          {Array.isArray(familyOrder) && familyOrder.length > 0
            ? familyOrder?.map((family: FamilyRecord) => {
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
              })
            : null}
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
