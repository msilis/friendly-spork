import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link, useRevalidator } from "@remix-run/react";
import { getClasses, getFamily, getStudents, updateFamily } from "~/data/data";
import React, { useRef, useState } from "react";
import { FamilyRecord, StudentRecord, ClassRecord } from "~/types/types";
import { useToast } from "~/hooks/hooks";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const [families, students, classes] = await Promise.all([
    getFamily(params?.lastname),
    getStudents(),
    getClasses(),
  ]);
  return Response.json({ families, students, classes });
};

const Family = () => {
  const { families, students, classes } = useLoaderData<typeof loader>();
  const family: FamilyRecord = families[0];
  const [showSecondParent, setShowSecondParent] = useState(false);
  const studentsInFamily = students.filter(
    (student: StudentRecord) => student.family_id === family.id
  );
  const toast = useToast();
  const revalidator = useRevalidator();
  const [formState, setFormState] = useState<FamilyRecord>({
    id: family.id,
    family_last_name: family.family_last_name,
    parent1_first_name: family.parent1_first_name,
    parent1_last_name: family.parent1_last_name,
    parent1_email: family.parent1_email,
    parent1_mobile_phone: family.parent1_mobile_phone,
    parent1_address: family.parent1_address,
    parent2_first_name: family.parent2_first_name,
    parent2_last_name: family.parent2_last_name,
    parent2_email: family.parent2_email,
    parent2_mobile_phone: family.parent2_mobile_phone,
    parent2_address: family.parent2_address,
  });

  const modalRef = useRef<HTMLDialogElement>(null);

  const handleOpenModal = () => {
    modalRef.current?.showModal();
  };

  const handleModalClose = () => {
    modalRef.current?.close();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    let newValue: string | number = value;
    if (name === "id") {
      newValue = Number(value);
    }

    setFormState({ ...formState, [name]: newValue });
  };

  const isFormDirty =
    JSON.stringify(formState) !== JSON.stringify(family) ? true : false;

  const handleSave = () => {
    let familyId = formState.id;
    if (formState.id) {
      familyId = Number(formState.id);
    }

    if (
      typeof formState.id !== "number" ||
      typeof formState.family_last_name !== "string" ||
      typeof formState.parent1_first_name !== "string" ||
      typeof formState.parent1_last_name !== "string" ||
      typeof formState.parent1_email !== "string" ||
      typeof formState.parent1_mobile_phone !== "string" ||
      typeof formState.parent1_address !== "string" ||
      (formState.parent2_first_name &&
        typeof formState.parent2_first_name !== "string") ||
      (formState.parent2_last_name &&
        typeof formState.parent2_last_name !== "string") ||
      (formState.parent2_email && typeof formState.parent2_email !== "string")
    ) {
      toast.error("There was an error updating the family");
      throw new Error("Invalid form data");
    }

    //TODO Fix validation

    const updatedData: FamilyRecord = {
      id: familyId,
      family_last_name: formState.family_last_name,
      parent1_first_name: formState.parent1_first_name,
      parent1_last_name: formState.parent1_last_name,
      parent1_email: formState.parent1_email,
      parent1_mobile_phone: formState.parent1_mobile_phone,
      parent1_address: formState.parent1_address,
    };
    if (formState.parent2_mobile_phone) {
      updatedData.parent2_mobile_phone = formState.parent2_mobile_phone;
    }
    if (formState.parent2_first_name) {
      updatedData.parent2_first_name = formState.parent2_first_name;
    }
    if (formState.parent2_last_name) {
      updatedData.parent2_last_name = formState.parent2_last_name;
    }
    if (formState.parent2_email) {
      updatedData.parent2_email = formState.parent2_email;
    }
    if (formState.parent2_address) {
      updatedData.parent2_address = formState.parent2_address;
    }

    updateFamily(updatedData, family.id?.toString());
    revalidator.revalidate();
    toast.success("Family info updated");
    handleModalClose();
  };

  const shouldShowSecondParent = showSecondParent || family.parent2_first_name;

  const studentsInClassMap: Record<number, ClassRecord[]> = {};

  studentsInFamily.forEach((student: StudentRecord) => {
    studentsInClassMap[Number(student.id)] = classes.filter(
      (classItem: ClassRecord) =>
        classItem.class_students.includes(Number(student.id))
    );
  });

  return (
    <>
      <Link to={"/families"}>
        <button className="btn-link">Back</button>
      </Link>
      <Link
        to={`/families/${
          family.id
        }/account?name=${family.family_last_name.toLowerCase()}`}
        viewTransition
      >
        <button className="btn btn-sm ml-4 mt-4">Family Account</button>
      </Link>
      <Link
        to={`/families/invoices/${
          family.id
        }?name=${family.family_last_name.toLowerCase()}`}
      >
        <button className="btn mt-4 btn-sm ml-2">Invoices</button>
      </Link>
      <section className="ml-12 flex gap-8">
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
          <button className="btn" onClick={() => handleOpenModal()}>
            Edit
          </button>
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
        <div className="ml-4 mt-4">
          <h2 className="font-bold pb-4">Students in family: </h2>
          <ul>
            {studentsInFamily
              ? studentsInFamily.map((student: StudentRecord) => {
                  return (
                    <li key={student.id} className="font-light">
                      {`${student.first_name} ${student.last_name}`}
                      <ul>
                        {studentsInClassMap[Number(student.id)].map(
                          (classItem: ClassRecord) => {
                            return (
                              <li
                                key={classItem.id}
                                className="ml-4 font-extralight text-s"
                              >
                                {classItem.class_name}
                              </li>
                            );
                          }
                        )}
                      </ul>
                    </li>
                  );
                })
              : null}
          </ul>
        </div>
      </section>

      <dialog id="family-edit-modal" className="modal" ref={modalRef}>
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-6">Edit</h3>
          <div className="flex flex-col gap-3 ml-8">
            <input
              name="parent1_first_name"
              placeholder={family.parent1_first_name}
              onChange={handleChange}
              type="text"
              className="input input-bordered w-full max-w-xs"
            />
            <input
              name="parent1_last_name"
              placeholder={family.parent1_last_name}
              onChange={handleChange}
              type="text"
              className="input input-bordered w-full max-w-xs"
            />
            <label htmlFor="parent1_email">Email</label>
            <input
              name="parent1_email"
              placeholder={family.parent1_email}
              onChange={handleChange}
              type="email"
              className="input input-bordered w-full max-w-xs"
            />
            <label htmlFor="parent1_mobile_phone">Mobile Phone</label>
            <input
              name="parent1_mobile_phone"
              placeholder={family.parent1_mobile_phone}
              onChange={handleChange}
              type="tel"
              className="input input-bordered w-full max-w-xs"
            />
            <label htmlFor="parent1_address">Parent 1 Address</label>
            <input
              name="parent1_address"
              placeholder={family.parent1_address ?? ""}
              onChange={handleChange}
              type="text"
              className="input input-bordered w-full max-w-xs"
            />
            <button
              className={showSecondParent ? "hidden" : "button mt-4"}
              onClick={() => setShowSecondParent(true)}
            >
              Add Second Parent?
            </button>

            {shouldShowSecondParent ? (
              <>
                <label htmlFor="parent2_first_name">Parent 2 First Name</label>
                <input
                  name="parent2_first_name"
                  placeholder={family.parent2_first_name ?? ""}
                  onChange={handleChange}
                  type="text"
                  className="input input-bordered w-full max-w-xs"
                />
                <label htmlFor="parent2_last_name">Parent 2 Last Name</label>
                <input
                  name="parent2_last_name"
                  placeholder={family.parent2_last_name ?? ""}
                  onChange={handleChange}
                  type="text"
                  className="input input-bordered w-full max-w-xs"
                />
                <label htmlFor="parent2_email">Email</label>
                <input
                  name="parent2_email"
                  placeholder={family.parent2_email ?? ""}
                  onChange={handleChange}
                  type="email"
                  className="input input-bordered w-full max-w-xs"
                />
                <label htmlFor="parent2_mobile_phone">Mobile Phone</label>
                <input
                  name="parent2_mobile_phone"
                  placeholder={family.parent2_mobile_phone ?? ""}
                  onChange={handleChange}
                  type="tel"
                  className="input input-bordered w-full max-w-xs"
                />
                <label htmlFor="parent2_address">Parent 2 Address</label>
                <input
                  name="parent2_address"
                  placeholder={family.parent2_address ?? ""}
                  onChange={handleChange}
                  type="text"
                  className="input input-bordered w-full max-w-xs"
                />
              </>
            ) : null}

            <button
              className={
                isFormDirty ? "btn btn-success mt-6" : "btn btn-disabled mt-6"
              }
              type="submit"
              onClick={() => handleSave()}
            >
              Save
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Family;
