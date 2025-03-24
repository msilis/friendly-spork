import {
  ClassRecord,
  FamilyRecord,
  InvoiceRecord,
  SaveDataType,
  StudentRecord,
  TeacherRecord,
  TransactionRecord,
} from "~/types/types";

const BACKEND_URL = "http://localhost:3000";

export const getStudents = async () => {
  console.log(
    typeof window === "undefined",
    "typeof window is undefined from get all students"
  );

  const allStudents = await fetch(`${BACKEND_URL}/students`).then((response) =>
    response.json()
  );
  return allStudents;
};

export const getStudent = async (params: string | undefined) => {
  try {
    const getStudent = await fetch(
      `${BACKEND_URL}/students/${params}/edit`
    ).then((response) => response.json());
    return getStudent;
  } catch (error) {
    console.error("There was an error getting that student: ", error);
  }
};

export const addStudent = async (data: StudentRecord) => {
  try {
    const addStudent = await fetch(`${BACKEND_URL}/students/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => response.json());
    return addStudent;
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
      `${BACKEND_URL}/students/${params}/edit`,
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
      `${BACKEND_URL}/students/${studentId}/delete`,
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
  const allFamilies = await fetch(`${BACKEND_URL}/families`).then((response) =>
    response.json()
  );
  return allFamilies;
};

export const getFamily = async (params: string | undefined | null) => {
  const family = await fetch(`${BACKEND_URL}/families/${params}`).then(
    (response) => response.json()
  );
  return family;
};

export const addFamily = async (data: FamilyRecord) => {
  try {
    const addFamily = await fetch(`${BACKEND_URL}/families/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => response.json());
    return addFamily;
  } catch (error) {
    console.error(error, "Error adding family");
  }
};

export const updateFamily = async (
  data: FamilyRecord,
  id: string | undefined
) => {
  try {
    const updateTeacher = await fetch(`${BACKEND_URL}/families/${id}/edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => response.json());
    return updateTeacher;
  } catch (error) {
    console.error(error, "There was an error updating the family record.");
  }
};

export const getTeachers = async () => {
  const allTeachers = await fetch(`${BACKEND_URL}/teachers`).then((response) =>
    response.json()
  );
  return allTeachers;
};

export const getAccompanists = async () => {
  const accompanists = await fetch(`${BACKEND_URL}/accompanists`).then(
    (response) => response.json()
  );
  return accompanists;
};

export const getTeacher = async (params: string | undefined) => {
  const teacher = await fetch(`${BACKEND_URL}/teachers/${params}/edit`).then(
    (response) => response.json()
  );
  return teacher;
};

export const addTeacher = async (data: TeacherRecord) => {
  try {
    const addTeacher = await fetch(`${BACKEND_URL}/teachers/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => response.json());
    return addTeacher;
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
      `${BACKEND_URL}/teachers/${params}/edit`,
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
  const allClasses = await fetch(`${BACKEND_URL}/classes`).then((response) =>
    response.json()
  );
  return allClasses;
};

export const getClass = async (params: string | undefined) => {
  const getClass = await fetch(`${BACKEND_URL}/classes/${params}/edit`).then(
    (response) => response.json()
  );
  return getClass;
};

export const addClass = async (data: ClassRecord) => {
  try {
    const addClass = await fetch(`${BACKEND_URL}/classes/add`, {
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
    const updateClass = await fetch(`${BACKEND_URL}/classes/${params}/edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => response.json());
    return updateClass;
  } catch (error) {
    console.error(error, "Error updating class");
  }
};

export const findStudentInClass = async (params: string | undefined) => {
  try {
    const findStudent = await fetch(
      `${BACKEND_URL}/classes/getstudent/${params}`,
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
      `${BACKEND_URL}/transactions/${params}`,
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
      `${BACKEND_URL}/transactions/get/${params}`,
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
    const saveTransaction = await fetch(`${BACKEND_URL}/transactions/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => response.json());
    return saveTransaction;
  } catch (error) {
    console.error("There was an error saving the transaction: ", error);
  }
};

type TransactionUpdateType = Omit<TransactionRecord, "account_id">;

export const updateTransaction = async (data: TransactionUpdateType) => {
  const id = data.id;
  try {
    const updateTransaction = await fetch(
      `${BACKEND_URL}/transactions/get/${Number(id)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    ).then((response) => response.json());
    return updateTransaction;
  } catch (error) {
    console.error("There was an error updating the transaction: ", error);
  }
};

export const deleteTransaction = async (params: number | undefined) => {
  const deleteTransaction = await fetch(
    `${BACKEND_URL}/transactions/get/${params}/delete`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((response) => response.json());
  return deleteTransaction;
};

type DateRangeType = {
  invoice_start_date: string;
  invoice_end_date: string;
  account_id: string | null;
};

// Gets transactions to generate invoice
export const getTransactionsForInvoice = async (data: DateRangeType) => {
  if (!data.account_id)
    throw new Error("Getting transactions for invoice needs an account id");
  try {
    const getTransactionsForInvoice = await fetch(
      `${BACKEND_URL}/transactions/range`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    ).then((response) => response.json());
    return getTransactionsForInvoice;
  } catch (error) {
    console.error(
      "There was an error getting transactions to generate an invoice"
    );
  }
};

//Gets transactions to recreate and view invoice
export const getTransactionsFromInvoice = async (
  invoiceId: number | undefined
) => {
  if (!invoiceId) {
    throw new Error("Getting transactions to recreate invoice needs an id");
  }
  try {
    const invoiceTransactions = await fetch(
      `$${BACKEND_URL}/transactions/invoices/recreate/${invoiceId}`
    ).then((response) => response.json());
    return invoiceTransactions;
  } catch (error) {
    console.error("Error retreiiving transactions from invoice: ", error);
  }
};

export const getLastInvoice = async () => {
  try {
    const retreiveLastInvoice = await fetch(
      `${BACKEND_URL}/transactions/invoices/get_last_record`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((response) => response.json());
    return retreiveLastInvoice;
  } catch (error) {
    console.error("Error getting last invoice: ", error);
  }
};

export const saveInvoice = async (data: SaveDataType) => {
  try {
    const saveInvoice = await fetch(
      `${BACKEND_URL}/transactions/invoices/save`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    ).then((response) => response.json());
    return saveInvoice;
  } catch (error) {
    console.error("There was an error saving the invoice: ", error);
  }
};

export const updateInvoice = async (data: InvoiceRecord | undefined) => {
  const invoiceId = data?.invoice_id;
  try {
    const updateInvoiceStatus = await fetch(
      `${BACKEND_URL}/transactions/invoices/update/${invoiceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    ).then((response) => response.json());
    return updateInvoiceStatus;
  } catch (error) {
    console.error("Error updating invoice");
  }
};

export const getAllInvoices = async () => {
  try {
    const retreiveAllInvoices = await fetch(
      `${BACKEND_URL}/transactions/invoices/get`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((response) => response.json());
    return retreiveAllInvoices;
  } catch (error) {
    console.error("Error getting all invoices: ", error);
  }
};

export const getInvoiceForFamily = async (familyId: string | undefined) => {
  try {
    const retreiveFamilyInvoices = await fetch(
      `${BACKEND_URL}/transactions/invoices/get/family/${familyId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((response) => response.json());
    return retreiveFamilyInvoices;
  } catch (error) {
    console.error("Error geting invoice for family");
  }
};

export const getInvoice = async (params: number) => {
  try {
    const retreiveInvoice = await fetch(
      `${BACKEND_URL}/transactions/invoices/get/${params}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((response) => response.json());
    return retreiveInvoice;
  } catch (error) {
    console.error("Error getting invoice: ", error);
  }
};

export const deleteInvoice = async (invoiceToDelete: number) => {
  try {
    const deleteInvoice = await fetch(
      `${BACKEND_URL}/transactions/invoices/${invoiceToDelete}/delete`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((response) => response.json());
    return deleteInvoice;
  } catch (error) {
    console.error("Error deleting invoice ", error);
  }
};

export const getSettings = async () => {
  const settings = await fetch(`${BACKEND_URL}/settings`).then((response) =>
    response.json()
  );
  return settings;
};

export const saveSettings = async (data: unknown) => {
  try {
    const saveSettings = await fetch(`${BACKEND_URL}/settings`, {
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
