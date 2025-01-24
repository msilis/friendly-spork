import { json } from "@remix-run/react";

import {
  ClassRecord,
  FamilyRecord,
  StudentRecord,
  TeacherRecord,
  TransactionRecord,
} from "~/types/types";

export const getStudents = async () => {
  const allStudents = await fetch(
    `${process.env.MANAGE_BACKEND}/students`
  ).then((response) => response.json());
  return allStudents;
};

export const getStudent = async (params: string | undefined) => {
  const getStudent = await fetch(
    `${process.env.MANAGE_BACKEND}/students/${params}/edit`
  ).then((response) => response.json());
  return getStudent;
};

export const addStudent = async (data: StudentRecord) => {
  try {
    const addStudent = await fetch(
      `${process.env.MANAGE_BACKEND}/students/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    ).then((response) => response.json());
    return json(addStudent);
  } catch (error) {
    console.error(error, "Error adding student");
  }
};

export const updateStudent = async (
  data: StudentRecord,
  params: string | undefined
) => {
  try {
    const updateStudent = await fetch(
      `http://localhost:3000/students/${params}/edit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    ).then((response) => response.json());
    return updateStudent;
  } catch (error) {
    console.error(error, "Error updating student");
  }
};

export const deleteStudent = async (studentId: number | undefined) => {
  if (studentId) {
    const deleteStudent = await fetch(
      `http://localhost:3000/students/${studentId}/delete`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((response) => response.json());
    return deleteStudent;
  } else {
    console.error("Nothing to delete, no id provided");
  }
};

export const getFamilies = async () => {
  const allFamilies = await fetch(
    `${process.env.MANAGE_BACKEND}/families`
  ).then((response) => response.json());
  return allFamilies;
};

export const getFamily = async (params: string | undefined) => {
  console.log(params, "params from data");
  const family = await fetch(
    `${process.env.MANAGE_BACKEND}/families/${params}`
  ).then((response) => response.json());
  return family;
};

export const addFamily = async (data: FamilyRecord) => {
  try {
    const addFamily = await fetch(
      `${process.env.MANAGE_BACKEND}/families/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    ).then((response) => response.json());
    return json(addFamily);
  } catch (error) {
    console.error(error, "Error adding family");
  }
};

export const updateFamily = async (
  data: FamilyRecord,
  id: string | undefined
) => {
  try {
    const updateTeacher = await fetch(
      `http://localhost:3000/families/${id}/edit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    ).then((response) => response.json());
    return updateTeacher;
  } catch (error) {
    console.error(error, "There was an error updating the family record.");
  }
};

export const getTeachers = async () => {
  const allTeachers = await fetch(
    `${process.env.MANAGE_BACKEND}/teachers`
  ).then((response) => response.json());
  return allTeachers;
};

export const getAccompanists = async () => {
  const accompanists = await fetch(
    `${process.env.MANAGE_BACKEND}/accompanists`
  ).then((response) => response.json());
  return accompanists;
};

export const getTeacher = async (params: string | undefined) => {
  const teacher = await fetch(
    `${process.env.MANAGE_BACKEND}/teachers/${params}/edit`
  ).then((response) => response.json());
  return teacher;
};

export const addTeacher = async (data: TeacherRecord) => {
  try {
    const addTeacher = await fetch(
      `${process.env.MANAGE_BACKEND}/teachers/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    ).then((response) => response.json());
    return json(addTeacher);
  } catch (error) {
    console.error(error, "Error adding teacher");
  }
};

export const updateTeacher = async (
  data: TeacherRecord,
  params: string | undefined
) => {
  try {
    const updateTeacher = await fetch(
      `http://localhost:3000/teachers/${params}/edit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    ).then((response) => response.json());
    return updateTeacher;
  } catch (error) {
    console.error(error, "Error updating teacher");
  }
};

export const getClasses = async () => {
  const allClasses = await fetch(`${process.env.MANAGE_BACKEND}/classes`).then(
    (response) => response.json()
  );
  return allClasses;
};

export const getClass = async (params: string | undefined) => {
  const getClass = await fetch(
    `${process.env.MANAGE_BACKEND}/classes/${params}/edit`
  ).then((response) => response.json());
  return getClass;
};

export const addClass = async (data: ClassRecord) => {
  try {
    const addClass = await fetch(`http://localhost:3000/classes/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => response.json());
    return addClass;
  } catch (error) {
    console.error(error, "Error adding class");
  }
};

export const updateClass = async (
  data: ClassRecord,
  params: string | undefined
) => {
  try {
    const updateClass = await fetch(
      `http://localhost:3000/classes/${params}/edit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    ).then((response) => response.json());
    return updateClass;
  } catch (error) {
    console.error(error, "Error updating class");
  }
};

export const findStudentInClass = async (params: string | undefined) => {
  try {
    const findStudent = await fetch(
      `http://localhost:3000/classes/getstudent/${params}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((response) => response.json());
    return findStudent;
  } catch (error) {
    console.error("Error getting student info from classes: ", error);
  }
};

export const getFamilyTransactions = async (params: string | undefined) => {
  try {
    const findTransactions = await fetch(
      `http://localhost:3000/transactions/${params}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((response) => response.json());
    return findTransactions;
  } catch (error) {
    console.error("There was an error getting transactions: ", error);
  }
};

export const getTransaction = async (params: string | undefined) => {
  try {
    const findTransaction = await fetch(
      `http://localhost:3000/transactions/get/${params}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((response) => response.json());
    return findTransaction;
  } catch (error) {
    console.error("There was an error getting the transaction", error);
  }
};

export const saveTransaction = async (data: TransactionRecord) => {
  try {
    const saveTransaction = await fetch(
      "http://localhost:3000/transactions/save",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    ).then((response) => response.json());
    return saveTransaction;
  } catch (error) {
    console.error("There was an error savig the transaction: ", error);
  }
};

export const getSettings = async () => {
  const settings = await fetch("http://localhost:3000/settings").then(
    (response) => response.json()
  );
  return settings;
};

export const saveSettings = async (data: unknown) => {
  try {
    const saveSettings = await fetch("http://localhost:3000/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => response.json());
    return saveSettings;
  } catch (error) {
    console.error("There was an error saving your settings: ", error);
  }
};
