import {
  Link,
  useSearchParams,
  useLoaderData,
  useParams,
  useRevalidator,
} from "@remix-run/react";
import { useState, useRef } from "react";
import { LoaderFunctionArgs } from "@remix-run/node";
import {
  deleteTransaction,
  getFamily,
  getFamilyTransactions,
  saveTransaction,
  updateTransaction,
  getStudents,
  getSettings,
} from "~/data/data";
import { FamilyRecord, StudentRecord, TransactionRecord } from "~/types/types";
import { useToast } from "~/hooks/hooks";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const [family, transactions, students, settings] = await Promise.all([
    getFamily(name),
    getFamilyTransactions(params.id),
    getStudents(),
    getSettings(),
  ]);
  return Response.json({ family, transactions, students, settings });
};

const FamilyAccount = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();
  const date = new Date();
  const param = searchParams.get("name");
  const [transactionData, setTransactionData] = useState<TransactionRecord>({
    transaction_date: date.toISOString().split("T")[0].toString(),
    account_id: Number(params.id),
    transaction_type: "payment",
    transaction_amount: "",
    transaction_description: "",
  });
  const [modalTransaction, setModalTransaction] = useState<TransactionRecord>({
    id: transactionData.id,
    transaction_date: "",
    account_id: transactionData.account_id,
    transaction_type: "",
    transaction_amount: "",
    transaction_description: "",
  });
  const [showDelete, setShowDelete] = useState<boolean>(false);

  const toast = useToast();
  const revalidator = useRevalidator();
  const editRef = useRef<HTMLDialogElement>(null);
  const convertAmount = (amount: number) => {
    return Math.round(amount * 100);
  };
  const convertToCurrency = (amount: number) => {
    return amount / 100;
  };

  const { family, transactions, students, settings } =
    useLoaderData<typeof loader>();
  const familyAccount: FamilyRecord = family[0];
  const studentsInFamily = students.filter(
    (student: StudentRecord) => student.family_id === familyAccount.id
  );

  const [quickAddStudent, setQuickAddStudent] = useState<number | undefined>(
    studentsInFamily[0]?.id
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    let newValue: string | number = value;
    if (name === "transaction_amount") {
      newValue = Number(value);
    }

    setTransactionData({ ...transactionData, [name]: newValue });
  };

  const calculateTotal = (transactionArray: TransactionRecord[]) => {
    let total = 0;
    for (const transaction of transactionArray) {
      const amount = Number(transaction.transaction_amount);
      if (isNaN(amount)) {
        throw new Error(
          `Amount is not a valid number: ${transaction.transaction_amount}`
        );
      }
      if (transaction.transaction_type === "payment") {
        total += amount;
      } else if (transaction.transaction_type === "charge") {
        total -= amount;
      } else if (transaction.transaction_type === "refund") {
        total += amount;
      } else if (transaction.transaction_type === "discount") {
        total += amount;
      }
    }

    return total;
  };

  const findTransactions = (id: number | undefined) => {
    return transactions.find((transaction: TransactionRecord) => {
      return transaction.id === id;
    });
  };

  const handleSave = () => {
    if (
      typeof transactionData.transaction_date !== "string" ||
      typeof transactionData.account_id !== "number" ||
      typeof transactionData.transaction_amount !== "number" ||
      typeof transactionData.transaction_type !== "string"
    ) {
      throw new Error("Invalid data");
    }
    saveTransaction({
      account_id: transactionData.account_id,
      transaction_date: transactionData.transaction_date,
      transaction_type: transactionData.transaction_type,
      transaction_amount: convertAmount(transactionData.transaction_amount),
      transaction_description: transactionData?.transaction_description,
    });
    revalidator.revalidate();
    setTransactionData({
      transaction_date: date.toISOString().split("T")[0].toString(),
      account_id: Number(params.id),
      transaction_type: "payment",
      transaction_amount: "",
    });
    toast.success("Transaction added");
  };

  const handleUpdate = () => {
    if (
      typeof modalTransaction.transaction_date !== "string" ||
      typeof modalTransaction.account_id !== "number" ||
      typeof modalTransaction.transaction_amount !== "number" ||
      typeof modalTransaction.transaction_type !== "string"
    ) {
      throw new Error("Invalid form data!");
    }
    updateTransaction({
      id: modalTransaction.id,
      transaction_date: modalTransaction.transaction_date,
      transaction_type: modalTransaction.transaction_type,
      transaction_amount: convertAmount(modalTransaction.transaction_amount),
      transaction_description: modalTransaction?.transaction_description,
    });
    revalidator.revalidate();
    editRef.current?.close();
    toast.success("Transaction updated");
  };

  const calculatedTotal = convertToCurrency(calculateTotal(transactions));

  const handleEditClick = async (id: number | undefined) => {
    const data = findTransactions(id);

    setModalTransaction({
      id: data.id,
      account_id: data.account_id,
      transaction_date: data.transaction_date,
      transaction_amount: convertToCurrency(data.transaction_amount),
      transaction_type: data.transaction_type,
      transaction_description: data.transaction_description,
    });
    editRef.current?.showModal();
  };

  const handleModalChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    let newValue: string | number = value;
    if (name === "transaction_amount") {
      newValue = value === "" ? "" : Number(value);
    }

    setModalTransaction({ ...modalTransaction, [name]: newValue });
  };
  // The isFormDirty was failing because transactions are kept as smallest unit
  // integers and modalTransaction uses currency. This fixes that.
  const normalisedFormData = (transactions: TransactionRecord) => {
    return {
      ...transactions,
      transaction_amount: convertToCurrency(
        Number(transactions?.transaction_amount)
      ),
    };
  };
  const isFormDirty =
    JSON.stringify(modalTransaction) !==
    JSON.stringify(normalisedFormData(findTransactions(modalTransaction.id)))
      ? true
      : false;

  const handleDeleteConfirm = (id: number | undefined) => {
    deleteTransaction(id);
    revalidator.revalidate();
    setShowDelete(false);
    editRef.current?.close();
  };

  const theoryPrice = settings.find(
    (setting: { settings_key: string; settings_value: string }) =>
      setting.settings_key === "theory_price"
  );

  const classPrice = settings.find(
    (setting: { settings_key: string; settings_value: string }) =>
      setting.settings_key === "per_student_price"
  );

  const siblindDiscountAmount = settings.find(
    (setting: { settings_key: string; settings_value: string }) =>
      setting.settings_key === "sibling_discount"
  );

  const [quickAddOption, setQuickAddOption] = useState("class");

  const handleQuickAdd = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setQuickAddOption(event.target.value);
  };

  const handleQuickAddStudent = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setQuickAddStudent(Number(event.target?.value));
  };

  const handleSaveQuickAdd = (option: string) => {
    if (option === "theory") {
      const saveData: TransactionRecord = {
        account_id: Number(params.id),
        transaction_date: String(
          new Date().toISOString().split("T")[0].toString()
        ),
        transaction_amount: convertAmount(theoryPrice.settings_value),
        transaction_type: "charge",
        transaction_description: `${
          studentsInFamily.find(
            (student: StudentRecord) => student.id === quickAddStudent
          ).first_name
        } - theory`,
      };

      saveTransaction(saveData);
      revalidator.revalidate();
      toast.success("Theory has been added");
    } else if (option === "class") {
      const saveAddClassData: TransactionRecord = {
        account_id: Number(params.id),
        transaction_date: String(
          new Date().toISOString().split("T")[0].toString()
        ),
        transaction_amount: convertAmount(classPrice.settings_value),
        transaction_type: "charge",
        transaction_description: `${
          studentsInFamily.find(
            (student: StudentRecord) => student.id === quickAddStudent
          ).first_name
        } - class`,
      };

      saveTransaction(saveAddClassData);
      revalidator.revalidate();
      toast.success("Class has been added");
    } else if (option === "sibling_discount") {
      const saveSiblingDiscountData: TransactionRecord = {
        account_id: Number(params.id),
        transaction_date: String(
          new Date().toISOString().split("T")[0].toString()
        ),
        transaction_amount: convertAmount(
          classPrice.settings_value *
            (siblindDiscountAmount.settings_value / 100)
        ),
        transaction_type: "discount",
        transaction_description: `${
          studentsInFamily.find(
            (student: StudentRecord) => student.id === quickAddStudent
          ).first_name
        } - sibling discount`,
      };

      saveTransaction(saveSiblingDiscountData);
      revalidator.revalidate();
      toast.success("Sibling discount added");
    }
  };

  return (
    <>
      <Link to={`/families/${param}`} viewTransition>
        <button className="btn-link">Back</button>
      </Link>
      <Link
        to={`/families/invoices/${
          familyAccount.id
        }?name=${familyAccount.family_last_name.toLowerCase()}`}
      >
        <button className="btn mt-4 btn-sm ml-2">Invoices</button>
      </Link>
      <h2 className="mt-4 font-bold">{`Account for ${familyAccount.family_last_name} Family`}</h2>
      <div className="h-1 border-2 border-black mr-4"></div>
      <section className="mt-2 flex gap-2 items-center">
        <h2 className="font-semibold">Add transaction:</h2>
        <label htmlFor="transaction_type">Transaction Type</label>
        <select
          name="transaction_type"
          id="transaction_type"
          onChange={handleChange}
          className="select select-bordered w-fit max-w-xs"
          value={transactionData.transaction_type}
        >
          <option value={"payment"}>Payment</option>
          <option value={"charge"}>Charge</option>
          <option value={"refund"}>Refund</option>
          <option value={"discount"}>Discount</option>
        </select>
        <label htmlFor="transaction_amount">Amount</label>
        <input
          type="number"
          className="input input-bordered"
          style={{ width: 100 }}
          placeholder="£"
          name="transaction_amount"
          value={transactionData.transaction_amount}
          onChange={handleChange}
        />
        <label htmlFor="transaction_date">Date</label>
        <input
          type="date"
          className="input input-bordered"
          name="transaction_date"
          id="transaction_date"
          onChange={handleChange}
          defaultValue={date.toISOString().split("T")[0].toString()}
        />
        <label htmlFor="transaction_description">Description</label>
        <input
          className="input input-bordered"
          type="text"
          name="transaction_description"
          id="transaction_description"
          onChange={handleChange}
          value={
            transactionData?.transaction_description
              ? transactionData.transaction_description
              : ""
          }
        />
        <button className="btn btn-info" onClick={handleSave}>
          Save
        </button>
      </section>
      {studentsInFamily.length > 0 ? (
        <section>
          <h2 className="font-semibold">Quick Add:</h2>
          <div>
            <select
              className="select select-bordered m-2 mr-2"
              onChange={(event) => handleQuickAddStudent(event)}
            >
              {studentsInFamily.map((student: StudentRecord) => {
                return (
                  <option key={student.id} value={student.id}>
                    {student.first_name}
                  </option>
                );
              })}
            </select>
            <select
              className="select select-bordered mr-2"
              onChange={(event) => handleQuickAdd(event)}
            >
              <option value="class">Add Class</option>
              <option value="theory">Add Theory</option>
              <option value="sibling_discount">Add Sibling Discount</option>
            </select>
            <button
              className="btn btn-neutral mr-2"
              onClick={() => handleSaveQuickAdd(quickAddOption)}
            >
              Save
            </button>
          </div>
        </section>
      ) : null}

      <section className="mt-4">
        <h2 className="font-bold mt-2">Recent Transactions</h2>
        <h3
          className={`${
            calculatedTotal >= 0 ? "text-green-400" : "text-red-700"
          }`}
        >
          Balance: £{calculatedTotal}
        </h3>
        <div className="h-1 border-2 border-black mr-4"></div>
        <div className="overflow-x-auto mt-6">
          <table className="table table-xs table-zebra w-2/3">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions
                ?.sort(
                  (a: TransactionRecord, b: TransactionRecord) =>
                    new Date(b.transaction_date).getTime() -
                    new Date(a.transaction_date).getTime()
                )
                .map((transaction: TransactionRecord, index: number) => {
                  const transactionType = transaction.transaction_type;
                  return (
                    <tr key={`${transaction.id}-${index}`}>
                      <td>{transaction.transaction_date}</td>
                      <td>
                        {transactionType[0]?.toUpperCase()}
                        {transactionType?.substring(1)}
                      </td>
                      <td
                        onClick={() => handleEditClick(transaction?.id)}
                        className={`${
                          transaction.transaction_type === "charge"
                            ? "text-red-700"
                            : ""
                        } ${
                          transaction.transaction_type === "payment"
                            ? "text-green-400"
                            : ""
                        } ${"hover:cursor-pointer"} ${
                          transaction.transaction_type === "discount" ||
                          transaction.transaction_type === "refund"
                            ? "text-blue-400"
                            : ""
                        } `}
                        title="Click to edit"
                      >
                        £
                        {convertToCurrency(
                          Number(transaction.transaction_amount)
                        )}
                      </td>
                      <td>{transaction?.transaction_description}</td>
                      <td>
                        {" "}
                        <button
                          onClick={() => handleDeleteConfirm(transaction?.id)}
                        >
                          <img
                            src="/icons8-delete.svg"
                            alt="delete student"
                            className="hover:cursor-pointer pl-2"
                            style={{ height: "20px" }}
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </section>
      <dialog ref={editRef} className="modal">
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => editRef.current?.close()}
          >
            ✕
          </button>
          <h2 className="font-bold">Edit Transaction</h2>
          <div className="flex flex-col gap-2">
            <label htmlFor="transaction_type">Transaction Type</label>
            <select
              name="transaction_type"
              id="transaction_type"
              onChange={handleModalChange}
              className="select select-bordered w-fit max-w-xs"
              value={modalTransaction.transaction_type}
            >
              <option value={"payment"}>Payment</option>
              <option value={"charge"}>Charge</option>
              <option value={"refund"}>Refund</option>
              <option value={"discount"}>Discount</option>
            </select>
            <label htmlFor="transaction_amount">Amount</label>
            <input
              type="number"
              className="input input-bordered"
              style={{ width: 100 }}
              name="transaction_amount"
              value={modalTransaction.transaction_amount}
              onChange={handleModalChange}
            />
            <label htmlFor="transaction_date">Date</label>
            <input
              type="date"
              className="input input-bordered"
              name="transaction_date"
              id="transaction_date"
              onChange={handleModalChange}
              value={modalTransaction.transaction_date}
            />
            <label htmlFor="transaction_description">Description</label>
            <input
              name="transaction_description"
              id="transaction_description"
              onChange={handleModalChange}
              className="input input-bordered"
              value={
                modalTransaction.transaction_description
                  ? modalTransaction.transaction_description
                  : ""
              }
            />
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className={
                  isFormDirty
                    ? "btn btn-sm btn-info text-white w-fit"
                    : "btn btn-disabled btn-sm w-fit"
                }
              >
                Update
              </button>
              <button
                className="btn btn-sm btn-warning w-fit"
                onClick={() => setShowDelete(true)}
              >
                Delete
              </button>
              <div
                className={
                  showDelete
                    ? "flex gap-2 pl-2 align-middle justify-center mt-1"
                    : "hidden"
                }
              >
                <h3>Are you sure?</h3>
                <button
                  className="btn btn-xs btn-active btn-secondary"
                  onClick={() => handleDeleteConfirm(modalTransaction?.id)}
                >
                  Yes
                </button>
                <button
                  className="btn btn-xs btn-neutral"
                  onClick={() => setShowDelete(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default FamilyAccount;
